"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQProps {
  data?: any[]
}

export function FAQ({ data }: FAQProps) {
  const faqs = data || []
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter text-primary">
            Dúvidas Frequentes
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border bg-white shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left font-medium text-slate-900"
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-secondary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 pt-0 text-slate-600 border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
