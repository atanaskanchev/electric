import { ReactComponent as SignalUrgentIcon } from '../assets/icons/claim.svg'
import { BsThreeDots as SignalNoPriorityIcon } from 'react-icons/bs'
import { ReactComponent as SignalMediumIcon } from '../assets/icons/signal-medium.svg'
import { ReactComponent as SignalStrongIcon } from '../assets/icons/signal-strong.svg'
import { ReactComponent as SignalWeakIcon } from '../assets/icons/signal-weak.svg'
import classNames from 'classnames'
import { Priority } from '../types/issue'

interface Props {
  priority: string
  className?: string
}

const ICONS = {
  [Priority.HIGH]: SignalStrongIcon,
  [Priority.MEDIUM]: SignalMediumIcon,
  [Priority.LOW]: SignalWeakIcon,
  [Priority.URGENT]: SignalUrgentIcon,
  [Priority.NONE]: SignalNoPriorityIcon,
}

export default function PriorityIcon({ priority, className }: Props) {
  const classes = classNames('w-3.5 h-3.5', className)

  const Icon = ICONS[priority.toLowerCase()]

  return <Icon className={classes} />
}