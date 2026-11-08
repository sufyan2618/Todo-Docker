import { ArrowUpRight } from 'lucide-react';

export default function Brand({ light = false }) {
  return <span className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><ArrowUpRight size={25} strokeWidth={2.5} /></span>todoflow<span className="brand-period">.</span></span>;
}
