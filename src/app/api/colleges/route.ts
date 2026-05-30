export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get("name") || "";
  
      const res = await fetch(
        `https://universities.hipolabs.com/search?country=India&name=${encodeURIComponent(name)}`
      );
  
      const data = await res.json();
  
      return Response.json(data);
    } catch (error: any) {
        console.error(error);
        console.error(error?.cause);
      
        return Response.json(
          {
            error: error.message,
            cause: String(error?.cause),
          },
          { status: 500 }
        );}
  }