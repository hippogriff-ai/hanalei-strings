import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

type Draw = (x: CanvasRenderingContext2D, w: number, h: number) => void;

function makeTex(w: number, h: number, draw: Draw, repeat?: [number, number]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

// horizontal-slat wall (the white/grey slatwall the ukuleles hang on)
export const slatwall = (rx = 3, ry = 2) =>
  makeTex(
    256,
    256,
    (x, w, h) => {
      x.fillStyle = "#e3e6e4";
      x.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 30) {
        x.fillStyle = "#c2c7c4";
        x.fillRect(0, y, w, 3);
        x.fillStyle = "#f1f3f1";
        x.fillRect(0, y + 3, w, 2);
      }
    },
    [rx, ry]
  );

// abstract painted-ukulele soundboard art (the colourful art ukes on the wall)
export const ukeArt = (palette: string[], seed = 0) =>
  makeTex(120, 200, (x, w, h) => {
    x.fillStyle = palette[0];
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) {
      const s = (seed * 31 + i * 17) % 97;
      x.fillStyle = palette[1 + ((seed + i) % (palette.length - 1))];
      x.globalAlpha = 0.85;
      x.beginPath();
      x.arc((s * 13) % w, (s * 29) % h, 8 + (s % 26), 0, 7);
      x.fill();
    }
    x.globalAlpha = 1;
  });

// reversed storefront-window signage (as seen from inside, like the photos)
export const windowSign = () =>
  makeTex(1024, 1024, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.save();
    x.translate(w, 0);
    x.scale(-1, 1); // mirror → reads reversed from inside
    x.textAlign = "center";
    x.fillStyle = "rgba(40,42,44,0.82)";
    x.font = "bold 52px Georgia, serif";
    x.fillText("UKULELES · PERCUSSION · GUITARS", w / 2, 120);
    x.font = "bold 46px Georgia, serif";
    x.fillText("YARN & KNITTING SUPPLIES", w / 2, 300);
    x.font = "italic 44px Georgia, serif";
    x.fillStyle = "rgba(60,62,64,0.7)";
    x.fillText("MAKING STUFF IS FUN", w / 2, 470);
    x.font = "bold 44px Georgia, serif";
    x.fillStyle = "rgba(40,42,44,0.82)";
    x.fillText("VINYL · RECORDS · CDS · BOOKS", w / 2, 900);
    x.restore();
  });

// round KALA ukulele sign hanging in the window
export const kalaSign = () =>
  makeTex(256, 256, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#5b3a1d";
    x.beginPath();
    x.arc(128, 128, 118, 0, 7);
    x.fill();
    x.strokeStyle = "#c9a05a";
    x.lineWidth = 7;
    x.stroke();
    x.fillStyle = "#f2e6cc";
    x.textAlign = "center";
    x.font = "bold 78px Georgia, serif";
    x.fillText("KALA", 128, 150);
    x.font = "italic 22px Georgia, serif";
    x.fillText("ukulele", 128, 185);
  });

// the Ching Young Village entrance sign
export const chingYoungSign = () =>
  makeTex(768, 256, (x, w, h) => {
    x.fillStyle = "#13322b";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "#0c1f1a";
    x.lineWidth = 10;
    x.strokeRect(5, 5, w - 10, h - 10);
    x.textAlign = "center";
    x.fillStyle = "#f4efe4";
    x.font = "bold 62px Georgia, serif";
    x.fillText("CHING YOUNG VILLAGE", w / 2, 92);
    x.fillStyle = "#e0b24a";
    x.font = "italic 40px Georgia, serif";
    x.fillText("· ALOHA ·", w / 2, 152);
    x.fillStyle = "#f4efe4";
    x.font = "28px Georgia, serif";
    x.fillText("THE HEART OF HANALEI", w / 2, 205);
  });

// generic shop sign
export const shopSign = (title: string, sub: string) =>
  makeTex(1280, 256, (x, w, h) => {
    x.fillStyle = "#23120a";
    x.fillRect(0, 0, w, h);
    x.fillStyle = "#e9c98c";
    x.fillRect(10, 10, w - 20, h - 20);
    x.fillStyle = "#23120a";
    x.textAlign = "center";
    x.font = "600 84px Georgia, serif";
    x.fillText(title, w / 2, 118);
    x.font = "italic 40px Georgia, serif";
    x.fillStyle = "#6e4a25";
    x.fillText(sub, w / 2, 188);
  });

// folded patterned textile (the quilts/yarn folded on the spool tables)
export const textile = (palette: string[], seed = 0) =>
  makeTex(128, 128, (x, w, h) => {
    x.fillStyle = palette[0];
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) {
      x.strokeStyle = palette[1 + ((seed + i) % (palette.length - 1))];
      x.lineWidth = 6;
      x.beginPath();
      x.moveTo(0, (i / 6) * h + 8);
      for (let xx = 0; xx <= w; xx += 16) x.lineTo(xx, (i / 6) * h + 8 + Math.sin(xx / 10 + seed) * 6);
      x.stroke();
    }
    for (let i = 0; i < 18; i++) {
      const s = (seed * 7 + i * 13) % 101;
      x.fillStyle = palette[1 + ((s + i) % (palette.length - 1))];
      x.beginPath();
      x.arc((s * 11) % w, (s * 19) % h, 4, 0, 7);
      x.fill();
    }
  });

// horizontal colour-band texture for the painted cable-spool drums
export const stripes = (colors: string[]) =>
  makeTex(64, 256, (x, w, h) => {
    const band = h / colors.length;
    colors.forEach((c, i) => {
      x.fillStyle = c;
      x.fillRect(0, i * band, w, band + 1);
    });
  });

// a framed black-and-white portrait (the photos high on the walls)
export const portrait = (seed = 0) =>
  makeTex(128, 160, (x, w, h) => {
    x.fillStyle = "#111";
    x.fillRect(0, 0, w, h);
    x.fillStyle = "#fff";
    x.fillRect(6, 6, w - 12, h - 12);
    const g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#cfcfcf");
    g.addColorStop(1, "#6f6f6f");
    x.fillStyle = g;
    x.fillRect(10, 10, w - 20, h - 20);
    x.fillStyle = "rgba(20,20,20,0.5)";
    x.beginPath();
    x.arc(w / 2, h * 0.42 + (seed % 3) * 4, 22, 0, 7); // a head silhouette
    x.fill();
    x.fillRect(w / 2 - 26, h * 0.6, 52, h * 0.3);
  });

// chalkboard ("make your own music" w/ notes)
export const chalkboard = () =>
  makeTex(256, 192, (x, w, h) => {
    x.fillStyle = "#1f2420";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "#4a3a22";
    x.lineWidth = 10;
    x.strokeRect(5, 5, w - 10, h - 10);
    x.fillStyle = "#e8e4d2";
    x.textAlign = "center";
    x.font = "italic 30px Georgia, serif";
    x.fillText("make your", w / 2, 70);
    x.fillText("own music", w / 2, 110);
    x.font = "34px Georgia, serif";
    x.fillText("♪ ♫ ♩ ♬", w / 2, 160);
  });

// neon sign (glowing script on transparent) — the "Live Music" / "Ukulele Lessons" / "OPEN" signs
export const neon = (text: string, color = "#ff4fd8", italic = true) =>
  makeTex(512, 200, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.textAlign = "center";
    x.font = `${italic ? "italic " : ""}bold 110px "Brush Script MT", "Snell Roundhand", cursive`;
    x.shadowColor = color;
    x.shadowBlur = 28;
    x.fillStyle = color;
    x.fillText(text, w / 2, h / 2 + 36);
    x.fillStyle = "#fff6ff";
    x.shadowBlur = 10;
    x.fillText(text, w / 2, h / 2 + 36);
  });

// warm carved-wood storefront sign with the whale logo (the night-side HANALEI STRINGS sign)
export const woodSign = () =>
  makeTex(1024, 256, (x, w, h) => {
    x.fillStyle = "#2a1a0e";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "#5a3c20";
    x.lineWidth = 12;
    x.strokeRect(8, 8, w - 16, h - 16);
    // whale fluke mark
    x.strokeStyle = "#d9b88a";
    x.lineWidth = 5;
    x.beginPath();
    x.moveTo(w / 2 - 60, 56);
    x.quadraticCurveTo(w / 2, 28, w / 2 + 60, 56);
    x.stroke();
    x.fillStyle = "#e9c98c";
    x.textAlign = "center";
    x.font = "bold 74px Georgia, serif";
    x.fillText("HANALEI STRINGS", w / 2, 178);
  });

// the black HANALEI STRINGS tee on a hanger
export const tee = () =>
  makeTex(200, 220, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#15161a";
    // simple tee silhouette
    x.beginPath();
    x.moveTo(40, 40);
    x.lineTo(70, 20);
    x.lineTo(130, 20);
    x.lineTo(160, 40);
    x.lineTo(185, 70);
    x.lineTo(160, 95);
    x.lineTo(160, 200);
    x.lineTo(40, 200);
    x.lineTo(40, 95);
    x.lineTo(15, 70);
    x.closePath();
    x.fill();
    x.fillStyle = "#dfe7e6";
    x.textAlign = "center";
    x.font = "bold 17px Georgia, serif";
    x.fillText("HANALEI", 100, 120);
    x.fillText("STRINGS", 100, 142);
  });
