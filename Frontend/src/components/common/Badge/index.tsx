const Badge = ({ status }: {
  status: number
}) => {
  return (
    <div className={`w-2 h-2 rounded-full bg-green-600 ${status === 1 ? 'bg-green-600' : status === 0 ? 'bg-orange-400' : 'bg-red-600'}`} />
  )
}

export default Badge;