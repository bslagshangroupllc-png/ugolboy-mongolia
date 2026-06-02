import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ugolboy_mongolia_landing_content_v2";
const AUTH_STORAGE_KEY = "ugolboy_admin_logged_in";

const ADMIN_USERNAME = "ugolboy";
const ADMIN_PASSWORD = "0707";

const DEFAULT_CONTENT = {
  facebookUrl: "https://www.facebook.com/ugolboymongol",
  images: {
    hero: "https://thb.tildacdn.com/tild6465-3136-4736-b235-626562663166/-/resize/1200x/4.png",
    fire: "https://thb.tildacdn.com/tild3131-6261-4133-a263-373938646563/-/resize/900x/noroot.png",
    coal: "https://thb.tildacdn.com/tild6262-6134-4530-b166-663632366162/-/resize/900x/noroot.png",
    product: "https://thb.tildacdn.com/tild3366-6532-4161-a362-623066303363/-/resize/900x/noroot.png",
    box: "https://thb.tildacdn.com/tild3061-3536-4739-a164-646563343233/-/resize/900x/noroot.png",
    background: "https://thb.tildacdn.com/tild3733-6230-4330-b265-666434333335/-/empty/_werw-24.png",
  },
  brand: {
    name: "УГОЛЬБОЙ МОНГОЛ",
    subtitle: "шорлогны нүүрс",
    phone: "8660-4989",
    footer: "© 2026 УГОЛЬБОЙ МОНГОЛ. Бүх эрх хуулиар хамгаалагдсан.",
  },
  hero: {
    badge: "Шорлогны нүүрс · Мах шарах · Утах · Камин",
    title: "Илүү удаан асдаг, илүү цэвэр",
    highlight: "UGOLBOY түлш",
    description: "ОХУ-д үйлдвэрлэсэн Pini Kay технологийн боловсруулсан түлш. Шорлог, мах шарах, ууц өвчүү утах, ресторан болон каминд тохиромжтой.",
    button: "Утсаар захиалах",
  },
  stats: [
    { value: "360 мин", label: "удаан асалт" },
    { value: "1.5-2%", label: "бага үнс" },
    { value: "2 кг / 10 кг", label: "савлагаа" },
  ],
  benefits: [
    { title: "Удаан асалт", text: "Тогтвортой дулаан өгч, шорлог болон махыг жигд болгоход тусална." },
    { title: "Цэвэр хэрэглээ", text: "Бутарч үйрэх нь бага, савлагаа дотор илүүдэл хог, үнс багатай." },
    { title: "Хүнсэнд тохиромжтой", text: "Шорлог, мах шарах, ууц өвчүү утах зэрэг ил галын хэрэглээнд зориулсан сонголт." },
    { title: "Pini Kay технологи", text: "Нягт шахсан хэлбэр нь дулааныг тогтвортой барихад чиглэсэн үйлдвэрлэлийн технологи." },
  ],
  specs: [
    { label: "Илчлэг", normal: "3500", briquette: "6700", ugolboy: "8600", unit: "ккал/кг" },
    { label: "Үнслэг", normal: "19", briquette: "7", ugolboy: "1.5-2", unit: "%" },
    { label: "Чийглэг", normal: "15", briquette: "8", ugolboy: "3-6", unit: "%" },
    { label: "Асах хугацаа", normal: "90", briquette: "240", ugolboy: "360", unit: "мин" },
  ],
  uses: [
    { title: "Шорлог, мах шарах", text: "Гэр бүл, найз нөхдийн BBQ, аялал, амралтын өдөрт.", image: "fire" },
    { title: "Ресторан, хоолны газар", text: "Ил галын мах, грилл, тогтмол галлагаатай гал тогоонд.", image: "product" },
    { title: "Ууц, өвчүү утах", text: "Уламжлалт хоол, баярын бэлтгэл, удаан дулаан шаардсан хэрэглээнд.", image: "coal" },
    { title: "Камин, ил зуух", text: "Дулаан уур амьсгал бүрдүүлэх, цэвэрхэн галлагаанд.", image: "hero" },
  ],
  products: [
    { title: "2 кг хайрцаг", subtitle: "Гэр бүл, аялал, жижиг гриллд тохиромжтой", text: "Шорлог, мах шарах, зуслангийн хэрэглээнд авч явахад хөнгөн, хадгалахад цэвэрхэн савлагаа.", badge: "Өдөр тутмын сонголт", image: "box" },
    { title: "10 кг хайрцаг", subtitle: "Ресторан, кафе, тогтмол хэрэглээнд тохиромжтой", text: "Ил гал дээр мах шарах, утах, олон удаагийн хэрэглээнд илүү хэмнэлттэй багц.", badge: "Бизнес хэрэглээ", image: "hero" },
    { title: "Нүүрс асаагч стартер", subtitle: "Түлшийг хурдан, жигд асаах туслах хэрэгсэл", text: "Гал бэлтгэх хугацааг хэмнэж, түлшийг илүү жигд асаахад тусална.", badge: "Дагалдах хэрэгсэл", image: "product" },
  ],
  steps: [
    "Хайрцгаа нээж түлшээ гаргана.",
    "Шаардлагатай бол 1-3 см хэмжээтэй жижиглэж бэлдэнэ.",
    "Хуурай асаагч эсвэл зориулалтын асаагч дээр байрлуулна.",
    "15-20 минут хүлээгээд нүүрсээ шарах хэсэгт жигд тараана.",
    "Гал тогтвортой болмогц хоолоо хийж эхэлнэ.",
  ],
  wholesale: {
    title: "Ресторан, амралтын газар, дэлгүүрт тогтмол нийлүүлнэ.",
    text: "Савлагаа, тоо хэмжээ, хүргэлтийн нөхцөлийг захиалгын хэмжээнд тохируулан ярилцана.",
    items: ["2 кг болон 10 кг савлагаа", "Ресторан, грилл, утах үйлчилгээ", "Бөөний болон давтан захиалга", "Монгол хэрэглээнд тохирсон зөвлөгөө"],
  },
  videos: [""],
  imageFits: {
    hero: "cover",
    fire: "cover",
    coal: "cover",
    product: "cover",
    box: "cover",
    background: "cover",
  },
};

function mergeContent(base, saved) {
  if (!saved || typeof saved !== "object") return base;
  if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;

  const result = { ...base };
  Object.keys(base).forEach((key) => {
    if (base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) {
      result[key] = mergeContent(base[key], saved[key]);
    } else if (saved[key] !== undefined) {
      result[key] = saved[key];
    }
  });
  return result;
}

function loadSavedContent() {
  if (typeof window === "undefined") return DEFAULT_CONTENT;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? mergeContent(DEFAULT_CONTENT, JSON.parse(raw)) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

function cleanPhone(phone) {
  return String(phone || "").replace(/[^0-9+]/g, "");
}

function getYouTubeEmbedUrl(url) {
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl) return "";

  try {
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.replace("www.", "");
    let id = "";

    if (host === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/watch")) {
        id = parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        id = parsed.pathname.split("/").filter(Boolean)[1] || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        id = parsed.pathname.split("/").filter(Boolean)[1] || "";
      }

      if (parsed.pathname.startsWith("/live/")) {
        id = parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
    }

    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function SectionTitle({ label, title, text }) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="mb-3 text-sm font-black uppercase tracking-widest text-orange-400">{label}</p>
      <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{title}</h2>
      {text ? <p className="mt-5 text-lg leading-8 text-neutral-400">{text}</p> : null}
    </div>
  );
}

function Img({ src, alt, className = "", fit = "cover" }) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  return <img src={src} alt={alt} loading="lazy" className={`h-full w-full ${fitClass} ${className}`} />;
}

function TextInput({ label, value, onChange, multiline = false, placeholder = "" }) {
  const className = "w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none ring-orange-500 transition focus:ring-2";

  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-neutral-300">{label}</span>
      {multiline ? (
        <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className={className} />
      ) : (
        <input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} />
      )}
    </label>
  );
}

function compressImage(base64Str, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress as JPEG with 70% quality
    };
  });
}

function ImageUpload({ label, value, onChange, fit = "cover", onFitChange }) {
  function handleFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Зөвхөн зураг файл оруулна уу.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          const compressed = await compressImage(reader.result);
          onChange(compressed);
        } catch (err) {
          console.error("Image compression error:", err);
          onChange(reader.result); // Fallback
        }
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 space-y-3">
      <p className="text-sm font-bold text-neutral-300">{label}</p>
      <div className="h-40 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 flex items-center justify-center">
        {value ? <Img src={value} alt={label} fit={fit} /> : <div className="flex h-full items-center justify-center text-sm text-neutral-500">Зураг байхгүй</div>}
      </div>
      <div className="grid gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-2xl border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-1.5 file:font-bold file:text-white hover:bg-neutral-800"
        />
        {onFitChange && (
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs font-bold text-neutral-400">Харагдах хэлбэр (Fit):</span>
            <div className="flex rounded-lg bg-neutral-900 p-0.5 border border-white/5">
              <button
                type="button"
                onClick={() => onFitChange("cover")}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                  fit === "cover"
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Cover
              </button>
              <button
                type="button"
                onClick={() => onFitChange("contain")}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                  fit === "contain"
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Contain
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 shrink-0">Илүү зураг URL:</span>
          <input 
            type="text" 
            value={value && value.startsWith('data:') ? '' : (value || '')} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="https://..." 
            className="flex-1 rounded-xl border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500" 
          />
        </div>
      </div>
    </div>
  );
}

function AdminBlock({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-neutral-900 p-5 shadow-xl">
      <h2 className="mb-5 text-2xl font-black">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function YouTubeLinkInput({ link, index, onChange, onRemove }) {
  const embedUrl = getYouTubeEmbedUrl(link);
  const hasValue = String(link || "").trim().length > 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
      <label className="block space-y-2">
        <span className="text-sm font-bold text-neutral-300">YouTube link {index + 1}</span>
        <input
          value={link || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none ring-orange-500 transition focus:ring-2"
        />
      </label>

      {hasValue && !embedUrl ? (
        <p className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          Энэ линк танигдахгүй байна. youtube.com/watch, youtu.be, shorts, live линк оруулна уу.
        </p>
      ) : null}

      {embedUrl ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              title={`YouTube preview ${index + 1}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">Линк бичмэгц автоматаар хадгалагдана.</p>
        <button type="button" onClick={onRemove} className="rounded-2xl border border-red-400/30 px-4 py-2 font-bold text-red-300 hover:bg-red-500/10">
          Устгах
        </button>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, goSite }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submitLogin(event) {
    event.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
      return;
    }

    setError("Нэвтрэх нэр эсвэл нууц үг буруу байна.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-10 text-white">
      <form onSubmit={submitLogin} className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl sm:p-8">
        <p className="text-sm font-black uppercase tracking-widest text-orange-400">Admin login</p>
        <h1 className="mt-3 text-3xl font-black">Нэвтрэх</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">Админ хэсэгт орохын тулд хэрэглэгчийн нэр, нууц үг оруулна уу.</p>

        <div className="mt-7 space-y-4">
          <TextInput label="User name" value={username} onChange={setUsername} placeholder="ugolboy" />
          <label className="block space-y-2">
            <span className="text-sm font-bold text-neutral-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none ring-orange-500 transition focus:ring-2"
            />
          </label>
        </div>

        {error ? <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</p> : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-600">
            Нэвтрэх
          </button>
          <button type="button" onClick={goSite} className="rounded-2xl border border-white/15 px-5 py-3 font-black text-white hover:bg-white/10">
            Сайт руу буцах
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminPage({ content, setContent, goSite, onLogout, onSaveToServer, isSaving }) {
  function updateObject(section, key, value) {
    setContent((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  }

  function updateImage(key, value) {
    setContent((current) => ({ ...current, images: { ...current.images, [key]: value } }));
  }

  function updateImageFit(key, value) {
    setContent((current) => ({
      ...current,
      imageFits: {
        ...(current.imageFits || {}),
        [key]: value
      }
    }));
  }

  function updateTop(key, value) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function updateArrayItem(arrayKey, index, key, value) {
    setContent((current) => ({
      ...current,
      [arrayKey]: current[arrayKey].map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  }

  function addArrayItem(arrayKey, item) {
    setContent((current) => ({ ...current, [arrayKey]: [...current[arrayKey], item] }));
  }

  function removeArrayItem(arrayKey, index) {
    setContent((current) => ({ ...current, [arrayKey]: current[arrayKey].filter((_, itemIndex) => itemIndex !== index) }));
  }

  function updateList(key, index, value) {
    setContent((current) => ({ ...current, [key]: current[key].map((item, itemIndex) => (itemIndex === index ? value : item)) }));
  }

  function addListItem(key) {
    setContent((current) => ({ ...current, [key]: [...current[key], ""] }));
  }

  function removeListItem(key, index) {
    setContent((current) => ({ ...current, [key]: current[key].filter((_, itemIndex) => itemIndex !== index) }));
  }

  function resetAll() {
    if (window.confirm("Бүх өөрчлөлтийг устгаад анхны мэдээлэл рүү буцаах уу?")) {
      window.localStorage.removeItem(STORAGE_KEY);
      setContent(DEFAULT_CONTENT);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-neutral-900 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-orange-400">Admin</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Ландинг хуудасны мэдээлэл засах</h1>
            <p className="mt-3 text-neutral-400">Өөрчлөлтийг 서버에 저장하기 버튼으로 업로드해 실시간 반영할 수 있습니다.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onSaveToServer} disabled={isSaving} className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-600 disabled:opacity-50">
              {isSaving ? "Хадгалж байна..." : "서버에 저장하기"}
            </button>
            <button type="button" onClick={goSite} className="rounded-2xl border border-white/15 px-5 py-3 font-black hover:bg-white/10">Сайтаа харах</button>
            <button type="button" onClick={resetAll} className="rounded-2xl border border-white/15 px-5 py-3 font-black hover:bg-white/10">Reset</button>
            <button type="button" onClick={onLogout} className="rounded-2xl border border-red-400/30 px-5 py-3 font-black text-red-200 hover:bg-red-500/10">Logout</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminBlock title="Үндсэн мэдээлэл">
            <TextInput label="Брэнд нэр" value={content.brand.name} onChange={(value) => updateObject("brand", "name", value)} />
            <TextInput label="Дэд тайлбар" value={content.brand.subtitle} onChange={(value) => updateObject("brand", "subtitle", value)} />
            <TextInput label="Утас" value={content.brand.phone} onChange={(value) => updateObject("brand", "phone", value)} />
            <TextInput label="Facebook URL" value={content.facebookUrl} onChange={(value) => updateTop("facebookUrl", value)} />
            <TextInput label="Footer" value={content.brand.footer} onChange={(value) => updateObject("brand", "footer", value)} multiline />
          </AdminBlock>

          <AdminBlock title="Hero хэсэг">
            <TextInput label="Badge" value={content.hero.badge} onChange={(value) => updateObject("hero", "badge", value)} />
            <TextInput label="Гарчиг" value={content.hero.title} onChange={(value) => updateObject("hero", "title", value)} />
            <TextInput label="Онцлох гарчиг" value={content.hero.highlight} onChange={(value) => updateObject("hero", "highlight", value)} />
            <TextInput label="Тайлбар" value={content.hero.description} onChange={(value) => updateObject("hero", "description", value)} multiline />
            <TextInput label="Товч" value={content.hero.button} onChange={(value) => updateObject("hero", "button", value)} />
          </AdminBlock>

          <AdminBlock title="Зураг upload">
            <p className="text-sm leading-6 text-neutral-400">URL бичихгүй. Компьютероосоо зураг сонгоод upload хийж солино.</p>
            {Object.entries(content.images).map(([key, value]) => (
              <ImageUpload 
                key={key} 
                label={`${key} зураг`} 
                value={value} 
                onChange={(newValue) => updateImage(key, newValue)} 
                fit={content.imageFits?.[key] || "cover"}
                onFitChange={(newFit) => updateImageFit(key, newFit)}
              />
            ))}
          </AdminBlock>

          <AdminBlock title="Статистик">
            {content.stats.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput label="Тоон утга" value={item.value} onChange={(value) => updateArrayItem("stats", index, "value", value)} />
                  <TextInput label="Тайлбар" value={item.label} onChange={(value) => updateArrayItem("stats", index, "label", value)} />
                </div>
                <button type="button" onClick={() => removeArrayItem("stats", index)} className="mt-3 text-sm font-bold text-red-300">Устгах</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("stats", { value: "", label: "" })} className="rounded-2xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10">Нэмэх</button>
          </AdminBlock>

          <AdminBlock title="Давуу талууд">
            {content.benefits.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <TextInput label="Гарчиг" value={item.title} onChange={(value) => updateArrayItem("benefits", index, "title", value)} />
                <TextInput label="Тайлбар" value={item.text} onChange={(value) => updateArrayItem("benefits", index, "text", value)} multiline />
                <button type="button" onClick={() => removeArrayItem("benefits", index)} className="mt-3 text-sm font-bold text-red-300">Устгах</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("benefits", { title: "", text: "" })} className="rounded-2xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10">Нэмэх</button>
          </AdminBlock>

          <AdminBlock title="Харьцуулалт">
            {content.specs.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput label="Үзүүлэлт" value={item.label} onChange={(value) => updateArrayItem("specs", index, "label", value)} />
                  <TextInput label="Нэгж" value={item.unit} onChange={(value) => updateArrayItem("specs", index, "unit", value)} />
                  <TextInput label="Нүүрс" value={item.normal} onChange={(value) => updateArrayItem("specs", index, "normal", value)} />
                  <TextInput label="Шахмал" value={item.briquette} onChange={(value) => updateArrayItem("specs", index, "briquette", value)} />
                  <TextInput label="UGOLBOY" value={item.ugolboy} onChange={(value) => updateArrayItem("specs", index, "ugolboy", value)} />
                </div>
                <button type="button" onClick={() => removeArrayItem("specs", index)} className="mt-3 text-sm font-bold text-red-300">Устгах</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("specs", { label: "", normal: "", briquette: "", ugolboy: "", unit: "" })} className="rounded-2xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10">Нэмэх</button>
          </AdminBlock>

          <AdminBlock title="Хэрэглээ">
            {content.uses.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <TextInput label="Гарчиг" value={item.title} onChange={(value) => updateArrayItem("uses", index, "title", value)} />
                <TextInput label="Тайлбар" value={item.text} onChange={(value) => updateArrayItem("uses", index, "text", value)} multiline />
                <TextInput label="Зургийн key" value={item.image} onChange={(value) => updateArrayItem("uses", index, "image", value)} placeholder="hero, fire, coal, product, box" />
                <button type="button" onClick={() => removeArrayItem("uses", index)} className="mt-3 text-sm font-bold text-red-300">Устгах</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("uses", { title: "", text: "", image: "hero" })} className="rounded-2xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10">Нэмэх</button>
          </AdminBlock>

          <AdminBlock title="Бүтээгдэхүүн">
            {content.products.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <TextInput label="Нэр" value={item.title} onChange={(value) => updateArrayItem("products", index, "title", value)} />
                <TextInput label="Дэд гарчиг" value={item.subtitle} onChange={(value) => updateArrayItem("products", index, "subtitle", value)} />
                <TextInput label="Тайлбар" value={item.text} onChange={(value) => updateArrayItem("products", index, "text", value)} multiline />
                <TextInput label="Badge" value={item.badge} onChange={(value) => updateArrayItem("products", index, "badge", value)} />
                <TextInput label="Зургийн key" value={item.image} onChange={(value) => updateArrayItem("products", index, "image", value)} placeholder="hero, fire, coal, product, box" />
                <button type="button" onClick={() => removeArrayItem("products", index)} className="mt-3 text-sm font-bold text-red-300">Устгах</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("products", { title: "", subtitle: "", text: "", badge: "", image: "hero" })} className="rounded-2xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10">Нэмэх</button>
          </AdminBlock>

          <AdminBlock title="Хэрэглэх заавар">
            {content.steps.map((step, index) => (
              <div key={index} className="flex gap-3 rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <input value={step} onChange={(event) => updateList("steps", index, event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none ring-orange-500 transition focus:ring-2" />
                <button type="button" onClick={() => removeListItem("steps", index)} className="rounded-2xl border border-red-400/30 px-4 font-bold text-red-300">Устгах</button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem("steps")} className="rounded-2xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10">Нэмэх</button>
          </AdminBlock>

          <AdminBlock title="Бөөний хэсэг">
            <TextInput label="Гарчиг" value={content.wholesale.title} onChange={(value) => updateObject("wholesale", "title", value)} multiline />
            <TextInput label="Тайлбар" value={content.wholesale.text} onChange={(value) => updateObject("wholesale", "text", value)} multiline />
          </AdminBlock>

          <AdminBlock title="YouTube видео">
            <p className="text-sm leading-6 text-neutral-400">
              Видео файлыг upload хийхгүй. YouTube дээр байршуулсан видеоны link-ийг энд хуулж оруулна. Линк зөв бол доор preview шууд гарна.
            </p>
            {content.videos.map((link, index) => (
              <YouTubeLinkInput
                key={index}
                link={link}
                index={index}
                onChange={(value) => updateList("videos", index, value)}
                onRemove={() => removeListItem("videos", index)}
              />
            ))}
            <button type="button" onClick={() => addListItem("videos")} className="rounded-2xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10">Видео линк нэмэх</button>
          </AdminBlock>
        </div>
      </div>
    </div>
  );
}

function LandingPage({ content, goAdmin }) {
  const phoneHref = `tel:${cleanPhone(content.brand.phone)}`;
  const imageUrl = (key) => content.images[key] || content.images.hero;
  const imageFit = (key) => content.imageFits?.[key] || "cover";
  const embedUrls = useMemo(() => content.videos.map(getYouTubeEmbedUrl).filter(Boolean), [content.videos]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-2xl bg-orange-500"><Img src={content.images.fire} alt="fire" fit={imageFit("fire")} /></div>
            <div>
              <p className="text-lg font-black tracking-wide">{content.brand.name}</p>
              <p className="text-xs text-neutral-400">{content.brand.subtitle}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-neutral-300 md:flex">
            <a className="hover:text-white" href="#benefits">Давуу тал</a>
            <a className="hover:text-white" href="#products">Бүтээгдэхүүн</a>
            <a className="hover:text-white" href="#usage">Хэрэглэх заавар</a>
            <a className="hover:text-white" href="#videos">Видео</a>
            <a className="hover:text-white" href="#contact">Холбоо барих</a>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={goAdmin} className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10 sm:block">Admin</button>
            <a href={phoneHref} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-neutral-950 hover:bg-orange-100">Захиалах</a>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-black">
          <div className="absolute inset-0 opacity-25"><Img src={content.images.background} alt="background" fit="cover" /></div>
          <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="space-y-7">
              <div className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm text-orange-100">{content.hero.badge}</div>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                  {content.hero.title}<span className="block text-orange-400">{content.hero.highlight}</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-neutral-300 sm:text-xl">{content.hero.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={phoneHref} className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-7 py-4 text-base font-black shadow-2xl shadow-orange-500/25 hover:bg-orange-600">{content.hero.button}</a>
                <a href="#products" className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-7 py-4 text-base font-bold hover:bg-white/10">Бүтээгдэхүүн харах</a>
              </div>
              <div className="grid max-w-2xl grid-cols-3 gap-3 pt-3">
                {content.stats.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-2xl font-black">{item.value}</p>
                    <p className="mt-1 text-xs text-neutral-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl shadow-orange-500/10">
              <div className="relative h-[520px]"><Img src={content.images.hero} alt="UGOLBOY" fit={imageFit("hero")} /></div>
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-neutral-950 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle label="Яагаад UGOLBOY?" title="Нүүрс сонгохдоо зөвхөн үнэ биш, галын чанарыг хар." text="Монгол хэрэглэгчид махаа хурдан түлэх биш, жигд болгохыг хүсдэг." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {content.benefits.map((item, index) => (
                <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10">
                  <div className="mb-5 h-16 w-16 overflow-hidden rounded-2xl"><Img src={index % 2 === 0 ? content.images.coal : content.images.fire} alt={item.title} fit={index % 2 === 0 ? imageFit("coal") : imageFit("fire")} /></div>
                  <h3 className="mb-3 text-xl font-black">{item.title}</h3>
                  <p className="leading-7 text-neutral-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <SectionTitle label="Харьцуулалт" title="Жирийн нүүрстэй харьцуулахад илүү үр ашигтай." text="Гал удаан барих, үнс бага үлдээх, дулаан тогтвортой өгөх нь хэрэглээний зардалд нөлөөлнө." />
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
              <div className="grid grid-cols-5 bg-white/5 px-4 py-4 text-sm font-bold text-neutral-300"><div className="col-span-2">Үзүүлэлт</div><div>Нүүрс</div><div>Шахмал</div><div className="text-orange-400">UGOLBOY</div></div>
              {content.specs.map((row, index) => (
                <div key={index} className="grid grid-cols-5 border-t border-white/10 px-4 py-5 text-sm sm:text-base">
                  <div className="col-span-2"><p className="font-bold">{row.label}</p><p className="text-xs text-neutral-500">{row.unit}</p></div>
                  <div className="text-neutral-400">{row.normal}</div><div className="text-neutral-400">{row.briquette}</div><div className="font-black text-orange-400">{row.ugolboy}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="usage" className="bg-neutral-950 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle label="Монгол хэрэглээ" title="Зөвхөн шорлог биш. Ил гал шаардсан олон хэрэглээнд." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {content.uses.map((item, index) => (
                <div key={index} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <div className="h-44 bg-neutral-900"><Img src={imageUrl(item.image)} alt={item.title} fit={imageFit(item.image)} /></div>
                  <div className="p-6"><h3 className="mb-3 text-xl font-black">{item.title}</h3><p className="leading-7 text-neutral-400">{item.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="bg-neutral-900 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <SectionTitle label="Бүтээгдэхүүн" title="Гэрийн хэрэглээ, ресторан, бөөний захиалгад." />
              <a href={phoneHref} className="rounded-2xl bg-orange-500 px-6 py-4 text-center font-black hover:bg-orange-600">Утсаар захиалах</a>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {content.products.map((item, index) => (
                <div key={index} className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-xl">
                  <div className="relative h-64 bg-neutral-900"><Img src={imageUrl(item.image)} alt={item.title} fit={imageFit(item.image)} /><div className="absolute left-5 top-5 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-black">{item.badge}</div></div>
                  <div className="p-6"><h3 className="text-2xl font-black">{item.title}</h3><p className="mt-2 font-bold text-orange-300">{item.subtitle}</p><p className="mt-4 leading-7 text-neutral-400">{item.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-950 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start">
            <SectionTitle label="Хэрэглэх заавар" title="Галаа зөв бэлдвэл хоол илүү жигд болно." text="Нүүрсийг хоолны торон дээр биш, доод галын хэсэгт байрлуулна." />
            <div className="space-y-4">
              {content.steps.map((step, index) => (
                <div key={index} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black">{index + 1}</div><p className="pt-2 text-lg font-semibold leading-7">{step}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500 to-red-700 p-8 shadow-2xl sm:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center"><div><p className="mb-3 text-sm font-black uppercase tracking-widest text-orange-100">Бөөний нийлүүлэлт</p><h2 className="text-4xl font-black tracking-tight sm:text-5xl">{content.wholesale.title}</h2><p className="mt-5 text-lg leading-8 text-orange-50">{content.wholesale.text}</p></div><div className="space-y-3 rounded-3xl bg-white/15 p-6 backdrop-blur">{content.wholesale.items.map((item, index) => <div key={index} className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black text-orange-600">✓</span><p className="font-bold">{item}</p></div>)}</div></div>
          </div>
        </section>

        <section id="videos" className="bg-neutral-950 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl"><SectionTitle label="Видео" title="UGOLBOY түлшийг бодит хэрэглээнд харах" text="Админ хэсгээс YouTube линк нэмэхэд видео автоматаар энд тоглогдоно." />
            {embedUrls.length > 0 ? <div className="grid gap-6 lg:grid-cols-2">{embedUrls.map((url, index) => <div key={url} className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl"><div className="aspect-video w-full"><iframe src={url} title={`UGOLBOY video ${index + 1}`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></div>)}</div> : <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-neutral-400">YouTube линк нэмэгдээгүй байна.</div>}
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden bg-neutral-950 px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-20"><Img src={content.images.fire} alt="fire" fit={imageFit("fire")} /></div>
          <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-neutral-900/90 p-8 text-center shadow-2xl backdrop-blur sm:p-12">
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-orange-400">Захиалга</p><h2 className="text-4xl font-black tracking-tight sm:text-5xl">Захиалга өгөхөд бэлэн үү?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-400">Үнэ, хүргэлт, бөөний нөхцөлийг шууд утсаар лавлаарай.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><a href={phoneHref} className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black hover:bg-orange-600">{content.brand.phone} дугаарт залгах</a><a href={content.facebookUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/15 px-8 py-4 text-lg font-black hover:bg-white/10">Facebook-р холбогдох</a></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl text-sm text-neutral-500">{content.brand.footer}</div></footer>
    </div>
  );
}

export default function UgolboyMongoliaLandingPage() {
  const [content, setContent] = useState(() => loadSavedContent());
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch content from server KV on mount
  useEffect(() => {
    async function fetchServerContent() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          if (data && !data.isNotConfigured && Object.keys(data).length > 0) {
            setContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch server content:", err);
      }
    }
    fetchServerContent();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // localStorage can be blocked in some environments.
    }
  }, [content]);

  async function handleSaveToServer() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        throw new Error("서버 저장에 실패했습니다.");
      }
      const data = await res.json();
      if (data.isNotConfigured) {
        alert("데이터베이스(Redis/KV) 설정이 감지되지 않았습니다. Vercel 프로젝트 대시보드에서 Storage -> Redis 또는 KV를 연결한 뒤 재배포(Redeploy)해 주세요.");
      } else {
        alert("서버에 성공적으로 저장되었습니다!");
      }
    } catch (err) {
      console.error(err);
      alert("서버 저장 중 오류가 발생했습니다: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    const syncRoute = () => setIsAdmin(window.location.hash === "#admin");
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  function goAdmin() {
    window.location.hash = "admin";
    setIsAdmin(true);
  }

  function goSite() {
    window.location.hash = "home";
    setIsAdmin(false);
  }

  function login() {
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
    } catch {
      // localStorage can be blocked in some environments.
    }
    setIsLoggedIn(true);
  }

  function logout() {
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // localStorage can be blocked in some environments.
    }
    setIsLoggedIn(false);
  }

  if (isAdmin) {
    if (!isLoggedIn) {
      return <LoginPage onLogin={login} goSite={goSite} />;
    }
    return <AdminPage content={content} setContent={setContent} goSite={goSite} onLogout={logout} onSaveToServer={handleSaveToServer} isSaving={isSaving} />;
  }

  return <LandingPage content={content} goAdmin={goAdmin} />;
}
