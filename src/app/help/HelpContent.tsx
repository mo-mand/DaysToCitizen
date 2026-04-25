'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import en, { type HelpContent } from './content/en';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h2>
      {children}
    </section>
  );
}

function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{q}</h3>
      <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function HelpContentComponent() {
  const { lang } = useLanguage();
  const [t, setT] = useState<HelpContent>(en);

  useEffect(() => {
    if (lang === 'en') {
      setT(en);
      return;
    }
    import(`./content/${lang}.ts`)
      .then((m) => setT(m.default as HelpContent))
      .catch(() => setT(en));
  }, [lang]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t.hero.title}</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {t.hero.introBefore} <strong>{t.hero.introBold}</strong> {t.hero.introAfter}
        </p>
      </div>

      {/* Requirement */}
      <Section title={t.requirement.title}>
        <p className="text-gray-600 leading-relaxed mb-4">
          {t.requirement.p1Before} <em>{t.requirement.p1Law}</em>{t.requirement.p1After}
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold mb-1">{t.requirement.keyRuleTitle}</p>
          <p className="text-red-700 text-sm">{t.requirement.keyRuleBody}</p>
        </div>
        <p className="text-gray-600 leading-relaxed">{t.requirement.p2}</p>
      </Section>

      {/* Status table */}
      <Section title={t.status.title}>
        <p className="text-gray-600 leading-relaxed mb-4">{t.status.intro}</p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">{t.status.thStatus}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">{t.status.thCounts}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">{t.status.thRate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="px-4 py-3 text-gray-800">{t.status.prStatus}</td>
                <td className="px-4 py-3 text-green-700 font-medium">{t.status.prCounts}</td>
                <td className="px-4 py-3 text-gray-600">{t.status.prRate}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{t.status.refugeeStatus}</td>
                <td className="px-4 py-3 text-green-700 font-medium">{t.status.refugeeCounts}</td>
                <td className="px-4 py-3 text-gray-600">{t.status.refugeeRate}</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 text-gray-800">{t.status.visitorStatus}</td>
                <td className="px-4 py-3 text-green-700 font-medium">{t.status.visitorCounts}</td>
                <td className="px-4 py-3 text-gray-600">{t.status.visitorRate}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{t.status.noneStatus}</td>
                <td className="px-4 py-3 text-red-600 font-medium">{t.status.noneCounts}</td>
                <td className="px-4 py-3 text-gray-600">{t.status.noneRate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm">{t.status.footer}</p>
      </Section>

      {/* How to */}
      <Section title={t.howto.title}>
        <ol className="space-y-4 text-gray-600">
          {[
            { title: t.howto.step1Title, body: t.howto.step1Body },
            { title: t.howto.step2Title, body: t.howto.step2Body },
            { title: t.howto.step3Title, body: t.howto.step3Body },
            { title: t.howto.step4Title, body: t.howto.step4Body },
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div>
                <strong className="text-gray-800">{step.title}</strong> {step.body}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <Section title={t.faq.title}>
        <Q q={t.faq.q1}><p>{t.faq.a1}</p></Q>
        <Q q={t.faq.q2}>
          <p>{t.faq.a2}</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
            <p className="text-green-800 font-semibold text-sm mb-2">{t.faq.a2ExampleTitle}</p>
            <ul className="text-green-700 text-sm space-y-1.5">
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">①</span>
                <span>{t.faq.a2ExampleLine1}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">②</span>
                <span>{t.faq.a2ExampleLine2}</span>
              </li>
            </ul>
          </div>
        </Q>
        <Q q={t.faq.q3}><p>{t.faq.a3}</p></Q>
        <Q q={t.faq.q4}><p>{t.faq.a4}</p></Q>
        <Q q={t.faq.q5}><p>{t.faq.a5}</p></Q>
        <Q q={t.faq.q6}>
          <p>
            {t.faq.a6Before}{' '}
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline"
            >
              {t.faq.a6Link}
            </a>{' '}
            {t.faq.a6After}
          </p>
        </Q>
        <Q q={t.faq.q7}><p>{t.faq.a7}</p></Q>
      </Section>

      {/* Mistakes */}
      <Section title={t.mistakes.title}>
        <ul className="space-y-3 text-gray-600">
          {[t.mistakes.m1, t.mistakes.m2, t.mistakes.m3, t.mistakes.m4, t.mistakes.m5].map((m, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <div className="bg-red-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">{t.cta.title}</h2>
        <p className="text-red-100 mb-6">{t.cta.subtitle}</p>
        <Link
          href="/"
          className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          {t.cta.button}
        </Link>
      </div>
    </main>
  );
}
