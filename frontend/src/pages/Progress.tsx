import { useTranslation } from "../i18n";

export default function Progress() {
  const { t } = useTranslation();
  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">{t("progress.title")}</h2>
        <p className="mt-2 text-sm text-slate-400">{t("progress.placeholder")}</p>
      </article>
    </section>
  );
}
