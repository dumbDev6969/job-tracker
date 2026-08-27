import { memo, useRef } from "react"
import { FileText, Download, UploadCloud, AlertCircle, Loader2, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ProfileResumeCardProps = {
  resumeFileName?: string
  resumeFileSize?: string
  resumeUpdatedAt?: string
  isUploadingResume: boolean
  onUploadResume: (file: File) => void
  onDownloadResume: () => void
  uploadError?: string | null
}

const ALLOWED_MIME_AND_EXTENSIONS = ".pdf,.doc,.docx,.odt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf"

export const ProfileResumeCard = memo(function ProfileResumeCard({
  resumeFileName,
  resumeFileSize,
  resumeUpdatedAt,
  isUploadingResume,
  onUploadResume,
  onDownloadResume,
  uploadError,
}: ProfileResumeCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadResume(file)
    }
    // Reset file input so selecting the same file again triggers onChange
    e.target.value = ""
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const hasResume = Boolean(resumeFileName && resumeFileName.trim() !== "")

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Resume / CV</CardTitle>
            <CardDescription>Your primary document for job submissions.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Hidden file input for secure document selection */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={ALLOWED_MIME_AND_EXTENSIONS}
          onChange={handleFileChange}
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Resume Info / Empty state */}
        {hasResume ? (
          <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-3.5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground sm:text-sm" title={resumeFileName}>
                  {resumeFileName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {resumeFileSize ? `${resumeFileSize} • ` : ""}Updated {resumeUpdatedAt || "Recently"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDownloadResume}
              className="size-8 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label="Download resume"
              title="Download resume"
            >
              <Download className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-5 text-center">
            <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileUp className="size-5" />
            </div>
            <p className="text-xs font-medium text-foreground">No resume uploaded yet</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Upload your resume or CV to easily manage and attach it to applications.
            </p>
          </div>
        )}

        {/* Validation or upload error message */}
        {uploadError && (
          <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span className="leading-tight">{uploadError}</span>
          </div>
        )}

        {/* Action Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={isUploadingResume}
          className="w-full gap-2 text-xs cursor-pointer"
        >
          {isUploadingResume ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="size-3.5" />
              <span>{hasResume ? "Upload New Version" : "Upload Resume / CV"}</span>
            </>
          )}
        </Button>

        <p className="text-center text-[10px] text-muted-foreground">
          Supported: PDF, DOC, DOCX, ODT, RTF (Max 5MB)
        </p>
      </CardContent>
    </Card>
  )
})
