interface PageHeaderProps {
  title: string
  description: string
}

// Cabeçalho padrão usado em todas as páginas para título e descrição.
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100 md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )
}
