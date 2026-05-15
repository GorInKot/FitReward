import { useTranslation } from "../i18n";

export default function Home() {
  const { t } = useTranslation();
  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-4 text-slate-950">
        <p className="text-sm font-medium">{t("home.greeting")}</p>
        <h2 className="mt-1 text-2xl font-bold">{t("home.todayTitle")}</h2>
      </div>
    </section>
  );
}
