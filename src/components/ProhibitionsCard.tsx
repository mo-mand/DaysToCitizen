'use client';

import { ShieldAlert, ExternalLink } from 'lucide-react';

const PROHIBITIONS = [
  'You are serving a term of imprisonment, on parole or on probation in Canada.',
  'You are serving a sentence outside Canada.',
  'You are charged with, on trial for, or involved in an appeal for an offence under the Citizenship Act, or an indictable offence in Canada.',
  'You are charged with, on trial for, or involved in an appeal for an offence committed outside Canada that is equivalent to an indictable offence in Canada.',
  'You are being investigated for, charged with, on trial for, or have been convicted of a war crime or a crime against humanity.',
  'You have had a citizenship application refused for misrepresentation in the past five years.',
  'You have had your Canadian citizenship revoked because of fraud in the past ten years.',
  'You have been convicted of an indictable offence in Canada or an offence under the Citizenship Act in the last 4 years.',
  'You have been convicted outside Canada of an offence equivalent to an indictable offence in Canada in the last 4 years, even if a pardon or amnesty was granted.',
  'While a permanent resident, you have been convicted of terrorism, high treason, treason, or spying offences.',
  'While a permanent resident, you served as a member of an armed force of a country or organized armed group that engaged in armed conflict with Canada.',
];

export function ProhibitionsCard() {
  return (
    <div className="bg-blue-50 rounded-2xl border border-blue-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-blue-100 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900">Who may not be eligible to apply</h3>
          <p className="text-xs text-blue-600 mt-0.5">
            You may be prohibited from applying for citizenship if any of the following apply to you:
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {PROHIBITIONS.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
            <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="pt-2 border-t border-blue-200 space-y-1.5">
        <p className="text-xs text-blue-700 font-medium">
          ⚠ This tracker only counts days of physical presence. It does not account for prohibitions or other eligibility criteria.
        </p>
        <p className="text-xs text-blue-600">
          Always verify your complete eligibility with official IRCC guidelines before applying.{' '}
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/become-canadian-citizen/eligibility.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-800 inline-flex items-center gap-0.5"
          >
            IRCC eligibility page <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
