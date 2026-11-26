When you rely on an app to catalog thousands of dollars in camera bodies, cine glass, serial numbers, purchase receipts, and shoot loadouts, **predictability isn’t optional—it’s the entire product.**

With **CameraShelf 2.75**, we’re shipping a major design and architecture update:

- **Refreshed “Optical Studio” Design:** A brand new and bright interface with beautiful colourful accents, natural typography, and softer cards (the classic Dark Mode and all classic palettes remain available anytime in Settings!).
- **Faster Local-First Storage Engine & Lossless Backups v2:** We are retiring automatic background iCloud Sync, moving CameraShelf onto a fast, reliable local-first engine, upgrading `.camerashelfbackup` to lossless **v2**, and beginning work on a brand-new, purpose-built cross-device sync architecture.

Read more below why we're doing these changes, how your existing gear catalog stays 100% protected, and what comes next.

---

### ✨ A Refreshed Interface

We refreshed CameraShelf’s default aesthetic to a theme we call **Optical Studio**: inspired by classic rangefinder metalwork and analog medium, trading heavy all-caps terminal chrome for clear, legible studio typography while keeping monospaced precision right where it belongs—serial numbers, focal lengths, apertures, weights, and valuations.

If you prefer a darkroom workspace or one of our classic color palettes, Dark Mode and all existing themes remain right where they’ve always been in **Settings → Theme & Appearance**.

---

### ⚙️ Why We’re Retiring Background iCloud Sync

CameraShelf originally used Apple’s iCloud to sync records in the background. While that approach works well for lightweight text notes, real-world camera inventories behave very differently—they carry high-resolution photos, PDF manuals, purchase receipts images and PDFs, nested items and subkits, and multi-quantity checkout logs.

Over the past several months, we ran into persistent limitations with iCloud that did not meet our reliability bar. We noticed this primarily from customer feedback who reported data not syncing to other devices or worse, data outright disappearing after a crash.

Working around these issues meant spending time fighting fire rather than giving photographers and filmmakers the rock-solid guarantees they deserve.

---

### 🛡️ Your Gear Library Is 100% Safe on Your Device

Updating to CameraShelf 2.75 requires **zero action** on your part:

1. **Seamless In-Place Upgrade:** CameraShelf opens your exact existing on-device database and external media storage in-place. Every item, kit, subkit, photo, receipt, PDF document, loan history, maintenance log, custom category, custom field, insurance policy, studio branding profile, and NFC tag remains 100% intact on your device.
2. **Automatic Pre-Transition Safety Snapshot:** On your first launch after updating, CameraShelf automatically records a fresh local backup snapshot in the background so you immediately have a clean restore point on disk.
3. **Lossless `.camerashelfbackup` v2 Archives:** We upgraded our on-device Automatic Backups format, capturing full-resolution photos, receipts, attached PDFs, checkout history, maintenance records, insurance policies, studio branding, and nested kits in a single portable archive (while remaining 100% backward-compatible with v1 backups). You can export `.camerashelfbackup` snapshots—or full ZIP, CSV, and PDF manifests—to **Apple Files, iCloud Drive, AirDrop, or external SSDs** anytime.
4. **Built-In “Restore Legacy iCloud Backup” Rescue Tool:** Upgraded to a brand-new iPhone and installing fresh from the App Store? Head to **Settings → Import Data & Restore Backup → Restore Legacy iCloud Backup**. CameraShelf includes a read-only rescue importer that scans your private legacy CloudKit container and pulls any missing gear, photos, and kits directly into your local library without duplicates.

---

### 🚀 What’s Coming Next

Retiring iCloud Sync doesn’t mean we’re giving up on multi-device workflows.

Instead, we are actively engineering a **brand-new, purpose-built cross-device sync solution from the ground up** designed specifically around media-rich gear libraries, sync conflict resolution, and instant responsiveness. We'll have more to share in the coming weeks as we get closer to launch, but we envision a full ecosystem for photographers and studios driven by personal, private, accounts, and flexible plans that allow you to share your data with your team, clients, or even set up rental agreements with confidence.

By establishing a clean, fast local-first foundation today, CameraShelf starts faster, runs deterministically offline in the field, and sets the stage for a dramatically better sync experience ahead.

Thank you for trusting CameraShelf with your kit. If you ever have questions or feedback, reach out anytime at [support@pandesalbytes.ca](mailto:support@pandesalbytes.ca).
