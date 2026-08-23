const download = "https://github.com/Chinteyley/neko/releases/latest";

export default function Page() {
  return (
    <main>
      <div className="stage" aria-hidden="true">
        <div className="pointer" />
        <div className="neko" />
      </div>
      <h1>neko</h1>
      <p className="sub">a kitten in the mac menu bar</p>
      <p>
        <a className="dl" href={download}>
          download for macOS
        </a>
      </p>
      <p className="note">
        free. a sign extra may come later. neko stays free.
      </p>
    </main>
  );
}
