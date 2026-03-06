export const maskPhone = (value: string) => {
  if (!value) return ""
  let v = value.replace(/\D/g, "")
  if (v.length > 11) v = v.substring(0, 11)

  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "($1) $2")
  if (v.length > 7) v = v.replace(/(\d{4,5})(\d{4})$/, "$1-$2")

  return v
}

export const maskCNPJ = (value: string) => {
  if (!value) return ""
  let v = value.replace(/\D/g, "")
  if (v.length > 14) v = v.substring(0, 14)

  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1.$2")
  if (v.length > 5) v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
  if (v.length > 8) v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
  if (v.length > 12) v = v.replace(/(\d{4})(\d)/, "$1-$2")

  return v
}

export const maskCurrency = (value: string) => {
  if (!value) return ""
  let v = value.replace(/\D/g, "")
  if (v === "") return ""

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

  const numberValue = parseFloat(v) / 100

  return formatter.format(numberValue)
}
