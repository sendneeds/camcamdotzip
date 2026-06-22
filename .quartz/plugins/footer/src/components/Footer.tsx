import { readFileSync } from "fs";
import { join } from "path";
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { i18n } from "../i18n";
import style from "./styles/footer.scss";

function getQuartzVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"));
    return pkg.version ?? "";
  } catch {
    return "";
  }
}

function getArenaDataUri(): string {
  try {
    const buf = readFileSync(join(process.cwd(), "quartz/static/arena.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return "/static/arena.png";
  }
}

const arenaSrc = getArenaDataUri();

export interface FooterOptions {
  links: Record<string, string>;
}

const InstagramIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const ArenaIcon = (
  <img src={arenaSrc} alt="Are.na" height="13" width="22" aria-hidden="true" />
);

const LinkedInIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.83v2.05h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.11V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8z" />
  </svg>
);

export default ((opts?: FooterOptions) => {
  const version = getQuartzVersion();

  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear();
    const links = opts?.links ?? {};
    return (
      <footer class={`${displayClass ?? ""}`}>
        <div class="footer-left">
          <span>created by cameron campbell</span>
          <a href="https://camcam.au">https://camcam.au</a>
        </div>

        <div class="footer-center">
          <a
            href="https://www.instagram.com/sendneeds"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            {InstagramIcon}
          </a>
          <a
            href="https://www.are.na/cameron-campbell-smmne9r9ufi/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Are.na"
          >
            {ArenaIcon}
          </a>
          <a
            href="https://www.linkedin.com/in/cameroncams/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            {LinkedInIcon}
          </a>
        </div>

        <div class="footer-right">
          <p>
            {i18n(cfg?.locale ?? "en-US").components.footer.createdWith}{" "}
            <a href="https://quartz.jzhao.xyz/">Quartz{version ? ` v${version}` : ""}</a> &copy;{" "}
            {year}
          </p>
          <ul>
            {Object.entries(links).map(([text, link]) => (
              <li>
                <a href={link}>{text}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    );
  };

  Footer.css = style;
  return Footer;
}) satisfies QuartzComponentConstructor;
