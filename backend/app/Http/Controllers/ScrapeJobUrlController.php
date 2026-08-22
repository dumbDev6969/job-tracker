<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;
use DOMDocument;
use DOMXPath;

class ScrapeJobUrlController extends Controller
{
    /**
     * Common job platform site names that shouldn't be used as the actual company name if a better candidate exists.
     */
    private const GENERIC_PLATFORMS = [
        'linkedin',
        'lever',
        'greenhouse',
        'workable',
        'jobvite',
        'ashby',
        'indeed',
        'ziprecruiter',
        'glassdoor',
        'wellfound',
        'angel.co',
        'y combinator',
        'workday',
        'smartrecruiters',
        'bamboohr',
    ];

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => ['required', 'url'],
        ]);

        $url = $validated['url'];

        try {
            $response = Http::timeout(5)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' => 'en-US,en;q=0.5',
                ])
                ->get($url);

            if (!$response->successful()) {
                return response()->json([
                    'company' => null,
                    'role' => null,
                ]);
            }

            $html = $response->body();
            $data = $this->extractMetadata($html, $url);

            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json([
                'company' => null,
                'role' => null,
            ]);
        }
    }

    private function extractMetadata(string $html, string $url): array
    {
        if (empty(trim($html))) {
            return ['company' => null, 'role' => null];
        }

        $ogSiteName = null;
        $ogTitle = null;
        $pageTitle = null;

        // Use DOMDocument with error suppression
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
        libxml_clear_errors();

        $xpath = new DOMXPath($dom);

        // Extract og:site_name
        $siteNameNodes = $xpath->query('//meta[@property="og:site_name"]/@content | //meta[@name="og:site_name"]/@content');
        if ($siteNameNodes && $siteNameNodes->length > 0) {
            $ogSiteName = trim($siteNameNodes->item(0)->nodeValue);
        }

        // Extract og:title
        $titleNodes = $xpath->query('//meta[@property="og:title"]/@content | //meta[@name="og:title"]/@content');
        if ($titleNodes && $titleNodes->length > 0) {
            $ogTitle = trim($titleNodes->item(0)->nodeValue);
        }

        // Extract <title>
        $docTitleNodes = $xpath->query('//title');
        if ($docTitleNodes && $docTitleNodes->length > 0) {
            $pageTitle = trim($docTitleNodes->item(0)->nodeValue);
        }

        $title = $ogTitle ?: $pageTitle;
        $company = $ogSiteName;
        $role = null;

        $host = parse_url($url, PHP_URL_HOST);
        $isLinkedIn = $host && str_contains(strtolower($host), 'linkedin.com');

        // LinkedIn specific extraction: "{Company} hiring {Role} in {Location}"
        if ($isLinkedIn && $title) {
            $linkedInData = $this->parseLinkedInTitle($title);
            if ($linkedInData) {
                if (!empty($linkedInData['company'])) {
                    $company = $linkedInData['company'];
                }
                if (!empty($linkedInData['role'])) {
                    $role = $linkedInData['role'];
                }
            }
        }

        // Try JSON-LD extraction first (widely used schema for JobPosting)
        if (!$role || !$company) {
            $jsonLdNodes = $xpath->query('//script[@type="application/ld+json"]');
            if ($jsonLdNodes && $jsonLdNodes->length > 0) {
                foreach ($jsonLdNodes as $node) {
                    $rawJson = trim($node->nodeValue);
                    if (empty($rawJson)) {
                        continue;
                    }
                    $json = json_decode($rawJson, true);
                    if (is_array($json)) {
                        $jsonItems = isset($json['@graph']) && is_array($json['@graph']) ? $json['@graph'] : [$json];
                        foreach ($jsonItems as $item) {
                            if (is_array($item) && isset($item['@type']) && (
                                $item['@type'] === 'JobPosting' || 
                                (is_array($item['@type']) && in_array('JobPosting', $item['@type']))
                            )) {
                                if (!$role && !empty($item['title']) && is_string($item['title'])) {
                                    $role = trim($item['title']);
                                }
                                if (!$company && !empty($item['hiringOrganization']['name']) && is_string($item['hiringOrganization']['name'])) {
                                    $company = trim($item['hiringOrganization']['name']);
                                }
                                break 2;
                            }
                        }
                    }
                }
            }
        }

        // If title exists and role is not yet found, attempt to parse role and company from common patterns
        if ($title && (!$role || !$company)) {
            $title = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $title = preg_replace('/\s+/', ' ', $title);

            // Pattern: "Role at Company" or "Role @ Company"
            if (preg_match('/^(.+?)\s+(?:at|@)\s+(.+?)(?:\s*[-–—|].*)?$/i', $title, $matches)) {
                $parsedRole = trim($matches[1]);
                $parsedCompany = trim($matches[2]);
                if (!$role) {
                    $role = $parsedRole;
                }
                if (!$company && !empty($parsedCompany) && !$this->isGenericPlatform($parsedCompany)) {
                    $company = $parsedCompany;
                }
            }
            // Pattern: "Company - Role" or "Role - Company" or "Role | Company"
            elseif (preg_match('/^(.+?)\s*[\-–—|]\s*(.+?)(?:\s*[\-–—|].*)?$/u', $title, $matches)) {
                $left = trim($matches[1]);
                $right = trim($matches[2]);

                if ($this->isGenericPlatform($right)) {
                    if (!$role) $role = $left;
                } elseif ($this->isGenericPlatform($left)) {
                    if (!$role) $role = $right;
                } else {
                    if ($ogSiteName && strcasecmp($left, $ogSiteName) === 0) {
                        if (!$company) $company = $left;
                        if (!$role) $role = $right;
                    } elseif ($ogSiteName && strcasecmp($right, $ogSiteName) === 0) {
                        if (!$company) $company = $right;
                        if (!$role) $role = $left;
                    } else {
                        if (!$role) $role = $left;
                        if (!$company) $company = $right;
                    }
                }
            } else {
                if (!$role) {
                    $role = $title;
                }
            }
        }

        // Clean up company if it is a generic platform
        if ($company && $this->isGenericPlatform($company)) {
            $company = null;
        }

        // Try extracting company from ATS URL paths (e.g. jobs.lever.co/company, boards.greenhouse.io/company, etc.)
        if (!$company) {
            $parsedUrl = parse_url($url);
            $host = strtolower($parsedUrl['host'] ?? '');
            $path = trim($parsedUrl['path'] ?? '', '/');
            $segments = explode('/', $path);

            if (preg_match('/(lever\.co|greenhouse\.io|ashbyhq\.com|workable\.com|smartrecruiters\.com)/i', $host)) {
                if (!empty($segments[0]) && !in_array(strtolower($segments[0]), ['jobs', 'embed', 'view', 'api'])) {
                    $company = ucwords(str_replace(['-', '_'], ' ', $segments[0]));
                } elseif (!empty($segments[1])) {
                    $company = ucwords(str_replace(['-', '_'], ' ', $segments[1]));
                }
            }
        }

        // If company is still not found, try to extract domain host name as a fallback hint
        if (!$company) {
            $host = parse_url($url, PHP_URL_HOST);
            if ($host) {
                $host = preg_replace('/^www\./i', '', $host);
                $parts = explode('.', $host);
                if (count($parts) >= 2 && !$this->isGenericPlatform($parts[0])) {
                    $company = ucfirst($parts[0]);
                }
            }
        }

        return [
            'company' => !empty($company) ? html_entity_decode($company, ENT_QUOTES | ENT_HTML5, 'UTF-8') : null,
            'role' => !empty($role) ? html_entity_decode($role, ENT_QUOTES | ENT_HTML5, 'UTF-8') : null,
        ];
    }

    private function isGenericPlatform(string $name): bool
    {
        $normalized = strtolower(trim($name));
        foreach (self::GENERIC_PLATFORMS as $platform) {
            if (str_contains($normalized, $platform)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Parses LinkedIn job posting titles formatted as:
     * "{Company} hiring {Role} in {Location}" or "{Company} hiring {Role}"
     */
    private function parseLinkedInTitle(string $title): ?array
    {
        $cleanTitle = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $cleanTitle = preg_replace('/\s*[-–—|]\s*LinkedIn.*$/i', '', $cleanTitle);
        $cleanTitle = trim(preg_replace('/\s+/', ' ', $cleanTitle));

        // Match: "{Company} [is] hiring [a/an] {Role and optional Location}"
        if (!preg_match('/^(.+?)\s+(?:is\s+)?hiring\s+(?:a\s+|an\s+)?(.+)$/iu', $cleanTitle, $matches)) {
            return null;
        }

        $companyCandidate = trim($matches[1]);
        $roleAndLocation = trim($matches[2]);

        if (empty($companyCandidate) || empty($roleAndLocation)) {
            return null;
        }

        // Separate "{Role}" and "in {Location}" if present using greedy matching on Role
        // to correctly preserve roles that contain "in" (e.g. "Specialist in Marketing in New York, NY")
        if (preg_match('/^(.*)\s+in\s+(.+)$/iu', $roleAndLocation, $locMatches)) {
            $roleCandidate = trim($locMatches[1]);
        } else {
            $roleCandidate = $roleAndLocation;
        }

        if (empty($roleCandidate)) {
            $roleCandidate = $roleAndLocation;
        }

        return [
            'company' => $companyCandidate,
            'role' => $roleCandidate,
        ];
    }
}
