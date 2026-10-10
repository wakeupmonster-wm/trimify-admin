import React from "react";
import trimifyLogo from "@/assets/web/trimifyLogo.png";
import { privacyContents } from "@/constants/privacypolicy";

const RichText = ({ html, className = "" }) => (
  <p
    className={className}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default function PublicPrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-700">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center px-5 py-4 sm:px-8">
          <img
            src={trimifyLogo}
            alt="Trimify"
            className="h-10 w-auto object-contain"
          />
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-app-primary2">
            Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            This policy explains how Trimify collects, uses, stores, and protects
            personal information when you use our services.
          </p>
        </div>

        <div className="space-y-9">
          {privacyContents.map((section) => {
            const Icon = section.icon;

            return (
              <section key={section.id} className="scroll-mt-6">
                <div className="mb-4 flex items-start gap-3">
                  {Icon && (
                    <div className="mt-0.5 rounded-lg bg-app-primary2/10 p-2 text-app-primary2">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  )}
                  <h2 className="pt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4 pl-0 sm:pl-12">
                  {section.content?.map((block, index) => {
                    if (block.subtitle) {
                      return (
                        <RichText
                          key={`${section.id}-subtitle-${index}`}
                          html={block.subtitle}
                          className="pt-1 text-base font-bold text-slate-900"
                        />
                      );
                    }

                    if (block.list) {
                      const List = block.listType === "alpha" ? "ol" : "ul";
                      const listClass =
                        block.listType === "alpha"
                          ? "list-[lower-alpha]"
                          : "list-disc";

                      return (
                        <List
                          key={`${section.id}-list-${index}`}
                          className={`space-y-1.5 pl-5 text-sm leading-6 text-slate-700 sm:text-base ${listClass}`}
                        >
                          {block.items?.map((item, itemIndex) => (
                            <li
                              key={`${section.id}-list-${index}-${itemIndex}`}
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          ))}
                        </List>
                      );
                    }

                    return block.text ? (
                      <RichText
                        key={`${section.id}-text-${index}`}
                        html={block.text}
                        className="text-sm leading-6 text-slate-700 sm:text-base"
                      />
                    ) : null;
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </article>
    </main>
  );
}
