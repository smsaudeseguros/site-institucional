"use client"
import { SolutionsFormModal } from "@/components/solutions-form-modal"
import { useState } from "react"

export default function TestPage() {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="p-10">
            <SolutionsFormModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                serviceTitle="Plano de Saúde"
                buttonTextForm="Enviar"
                pjCheckboxText="Tenho CNPJ"
            />
        </div>
    )
}