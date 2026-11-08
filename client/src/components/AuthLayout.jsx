import { Check, ArrowUpRight, Asterisk } from 'lucide-react';
import Brand from './Brand';

export default function AuthLayout({ children }) {
  return <main className="auth-shell">
    <section className="auth-story">
      <Brand light />
      <div className="story-content"><span className="eyebrow">A LITTLE STRUCTURE. A LOT OF POSSIBILITY.</span>
        <h1>Make room<br />for what<br /><em>matters.</em></h1>
        <p>A clear mind starts with a clear list.<br />Find your flow, one small task at a time.</p>
        <div className="paper-scene" aria-hidden="true">
          <div className="orange-orbit"><Asterisk /></div>
          <div className="paper-note"><span className="note-kicker">THE EVERYDAY EDIT</span><h3>Less noise.<br />More doing.</h3><div><span className="note-check"><Check size={13} /></span> Make a little progress</div><div><span className="note-check"><Check size={13} /></span> Take a well-earned break</div><div className="note-unchecked"><span /> Enjoy the process</div><ArrowUpRight className="note-arrow" /></div>
          <span className="scene-caption">Small steps, good days.</span>
        </div>
      </div>
      <footer className="story-footer"><span>YOUR DAY, WITH INTENTION.</span><span>EST. 2026 ↗</span></footer>
    </section>
    <section className="auth-form-side"><div className="mobile-brand"><Brand /></div>{children}<footer className="auth-footer">A calmer place to get things done.</footer></section>
  </main>;
}
