export function getImageUrl(path?: string | null, fallbackName: string = ""): string {
    if (!path) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fallbackName
      )}&background=00535B&color=fff`;
    }
  
    // إذا كان الرابط خارجي بالكامل (مثل Cloudinary أو S3)
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
  
    // استخدام المتغير البيئي للباك إند
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
    return `${apiUrl}${cleanPath}`;
  }