# ToolMandi — Free Online Tools

Free online tools that run **100% in the browser** — no uploads, no signup, no watermark. Files never leave the user's device.

**Live:** https://sheikhroot.github.io/toolmandi/

## Tools (Phase 1)
- **Compress Image to KB** — exact-KB compression with Pakistani form presets (FPSC 50KB, PPSC/MDCAT 100KB, NTS 60KB, signature 20KB)
- **Passport Photo Maker** — 35×45mm, 40×60mm (CNIC), 2×2in + print sheet
- **Resize Image** — exact pixels + social/form presets
- **Image Converter** — JPG / PNG / WebP, bulk
- **Image to PDF** — A4 or fit-to-image pages (jsPDF)
- **Merge PDF** — combine PDFs in chosen order (pdf-lib)
- **WhatsApp Link Generator** — wa.me link with pre-filled message + QR
- **YouTube Thumbnail Downloader** — HD/SD/HQ/MQ
- **QR Code Generator** — PNG up to 2048px
- **Word Counter** — words, characters, reading time, keyword density
- **Age Calculator** — exact years/months/days

## How it works
Plain static HTML/CSS/JS. Image work uses the browser Canvas API (exact-KB via binary search on JPEG quality). PDF work uses vendored pdf-lib / jsPDF. QR codes use vendored qrcode-generator. No backend, no build step.

## Privacy model
Every tool processes files locally in the browser. There is no server to upload to — that is the product's core promise.

Built in Chiniot, Pakistan — part of the Sheikh Root tools portfolio.
