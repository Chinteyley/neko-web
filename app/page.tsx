import { downloadHref, projectPageUrl } from "@/lib/site";

export default function Page() {
  return (
    <>
      <main>
        <div className="stage" aria-hidden="true">
          <div className="neko-track">
            <div className="neko" />
          </div>
        </div>
        <h1>neko</h1>
        <p className="sub">a kitten in the mac menu bar</p>
        <p>
          <a className="dl" href={downloadHref}>
            download for macOS
          </a>
        </p>
      </main>
      <section className="sr-only">
        <p>
          Neko is a free macOS menu bar app that places a pixel kitten on your
          desktop. The kitten follows your cursor around the screen, stays on
          top of other windows, and never appears in the Dock, so it stays out
          of the way while you work. Keep Neko running from the menu bar instead
          of taking a Dock icon. Download the free Neko app for macOS from
          GitHub Releases. Learn more about the project, including background
          and source, on the{" "}
          <a href={projectPageUrl}>Neko project page</a>.
        </p>
      </section>
    </>
  );
}
