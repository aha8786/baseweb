export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          개발자 포트폴리오 & 커뮤니티
        </h1>
        <p className="text-lg text-muted-foreground">
          당신의 개발 여정을 공유하고 다른 개발자들과 소통하세요
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">포트폴리오</h2>
          <p className="text-muted-foreground mb-4">
            당신의 프로젝트와 기술 스택을 선보이세요
          </p>
          <ul className="space-y-2 text-sm">
            <li>✓ 프로젝트 쇼케이스</li>
            <li>✓ 기술 스택 프로필</li>
            <li>✓ 경력 및 교육 이력</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">커뮤니티</h2>
          <p className="text-muted-foreground mb-4">
            다른 개발자들과 지식을 공유하고 소통하세요
          </p>
          <ul className="space-y-2 text-sm">
            <li>✓ 기술 토론</li>
            <li>✓ 코드 리뷰</li>
            <li>✓ 개발 팁 공유</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
