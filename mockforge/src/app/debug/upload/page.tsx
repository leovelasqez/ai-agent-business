import { notFound } from "next/navigation";
import DebugUploadClient from "./debug-upload-client";

export default function DebugUploadPage() {
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_ENABLE_DEBUG_UPLOAD_PAGE) {
    notFound();
  }

  return <DebugUploadClient />;
}
