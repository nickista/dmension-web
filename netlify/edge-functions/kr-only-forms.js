// 폼 제출(POST)을 대한민국에서 온 요청으로만 제한한다.
//
// 해외(인도 등) 봇이 Netlify Forms 엔드포인트로 직접 보내는 스팸을
// 엣지 단에서 차단한다. reCAPTCHA/허니팟을 통과하더라도 여기서 걸린다.
// GET 등 일반 페이지 트래픽은 건드리지 않는다.
//
// 판정 기준: Netlify가 붙여 주는 요청 지오IP (context.geo).
// - KR 이면 통과
// - 확실한 해외면 403 차단
// - 지오IP 자체가 없으면(엣지 장애 등) 정상 고객 차단을 피하려고 통과시킴

export default async (request, context) => {
  // 폼 전송은 POST 뿐. 나머지는 즉시 통과.
  if (request.method !== "POST") return;

  const geo = context.geo;
  const code = geo && geo.country && geo.country.code;

  // 지오 정보가 아예 없으면 인프라 이슈로 보고 통과 (fail-open).
  if (!code) return;

  // 국내 요청은 통과.
  if (code === "KR") return;

  // 그 외 확실한 해외 요청만 차단.
  return new Response(
    "문의 접수는 대한민국 내에서만 가능합니다.\n" +
      "Inquiries can only be submitted from within South Korea.",
    {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    },
  );
};

export const config = {
  // 모든 경로를 검사하되(봇은 아무 경로로나 POST 함) 정적 자원은 제외.
  path: "/*",
  excludedPath: [
    "/images/*",
    "/video/*",
    "/*.css",
    "/*.js",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.svg",
    "/*.webp",
    "/*.ico",
    "/*.woff",
    "/*.woff2",
  ],
};
