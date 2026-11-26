import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, VolumeX, MapPin, Calendar, Clock, Navigation, Send, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { WEDDING, COUPLE_NAMES } from '../config/wedding';

// Sakura theme images (public/sakura/)
const IMG = {
  petalsBg: '/sakura/petals-bg.jpg',
  frame: '/sakura/frame.jpg',
  bloomsBg: '/sakura/blooms-bg.jpg',
  flower: '/sakura/flower.png',
  heroBg: '/sakura/hero-bg.jpg',
};

export const SAKURA_IMAGE_URLS = Object.values(IMG);

interface SakuraInvitationProps {
  active: boolean;
  eventParam: string;
  fullInviteeName: string;
  eventLabel: string;
  weddingDate: Date;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

/* ---------------------------------------------------------------- helpers */

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, ease: 'easeOut' as const },
};

function Flower({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <img src={IMG.flower} alt="" aria-hidden="true" draggable={false} className={`select-none pointer-events-none ${className}`} style={style} />;
}

/** Small heading used above every section: flower · label · flower */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-sakura-deep/50" />
      <Flower className="w-5 h-5" />
      <span className="uppercase tracking-[0.45em] text-[10px] sm:text-[11px] font-semibold text-sakura-deep font-sans">{children}</span>
      <Flower className="w-5 h-5" />
      <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-sakura-deep/50" />
    </div>
  );
}

/** Falling sakura flowers over the whole page */
function FallingSakura() {
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: (i * 6.3 + (i % 3) * 7) % 100,
        size: 12 + ((i * 7) % 16),
        duration: 11 + ((i * 5) % 9),
        delay: -((i * 1.7) % 18),
        drift: (i % 2 ? 1 : -1) * (30 + ((i * 11) % 50)),
        opacity: 0.55 + ((i * 13) % 40) / 100,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <img
          key={i}
          src={IMG.flower}
          alt=""
          className="sakura-fall absolute -top-12"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- sections */

function Hero({ inviteeName }: { inviteeName: string }) {
  const d = new Date(WEDDING.dateISO);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1.1, delay, ease: 'easeOut' as const },
  });

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#ffccdf]">
      {/* Wide screens: soft blurred backdrop behind the portrait card */}
      <img src={IMG.heroBg} alt="" aria-hidden="true" className="hidden sm:block absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-80" />
      <div className="hidden sm:block absolute inset-0 bg-white/25" />

      {/* Portrait card: full screen on phones, framed card on wider screens */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[100svh] sm:w-auto sm:h-[92vh] sm:aspect-[9/16] sm:rounded-[2.5rem] overflow-hidden sm:shadow-[0_40px_90px_rgba(158,61,90,0.35)]"
      >
        <motion.img
          src={IMG.heroBg}
          alt=""
          fetchPriority="high"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Soft light behind the text */}
        <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[85%] h-[45%] rounded-full bg-white/40 blur-3xl" />
        {/* Fine inner frame */}
        <div className="absolute inset-3 sm:inset-4 rounded-[1.75rem] sm:rounded-[2rem] border border-white/80 pointer-events-none" />
        <div className="absolute inset-[18px] sm:inset-[22px] rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/40 pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col items-center text-center px-8">
          <div className="flex-[2]" />

          <motion.div {...fade(0.3)} className="flex items-center gap-3 text-sakura-plum">
            <span className="h-px w-8 bg-sakura-plum/40" />
            <span className="uppercase tracking-[0.5em] text-[10px] font-medium font-sans">The Wedding Of</span>
            <span className="h-px w-8 bg-sakura-plum/40" />
          </motion.div>

          <motion.h1 {...fade(0.6)} className="mt-4 font-display text-sakura-rose leading-[1.05] drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
            <span className="block text-[3.9rem] sm:text-7xl">{WEDDING.groom.name}</span>
            <span className="flex items-center justify-center gap-4 my-1">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-sakura-rose/60" />
              <span className="font-serif italic text-3xl text-sakura-plum/80">&</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-sakura-rose/60" />
            </span>
            <span className="block text-[3.9rem] sm:text-7xl">{WEDDING.bride.name}</span>
          </motion.h1>

          <motion.div {...fade(0.9)} className="mt-6 flex items-center justify-center gap-3 sm:gap-4 text-sakura-plum">
            <span className="w-20 sm:w-24 border-y border-sakura-plum/40 py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-sans">{weekday}</span>
            <span className="flex flex-col items-center leading-none">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-sans">{month}</span>
              <span className="font-serif text-5xl text-sakura-rose my-1">{d.getDate()}</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-sans">{d.getFullYear()}</span>
            </span>
            <span className="w-20 sm:w-24 border-y border-sakura-plum/40 py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-sans">At {time}</span>
          </motion.div>

          <motion.p {...fade(1.1)} className="mt-5 max-w-[16rem] text-[9px] sm:text-[10px] uppercase tracking-[0.3em] leading-relaxed text-sakura-plum/90 font-sans">
            {WEDDING.venue.name} · {WEDDING.venue.city}
          </motion.p>

          {inviteeName && (
            <motion.p {...fade(1.3)} className="mt-4 font-serif italic text-base sm:text-lg text-sakura-plum">
              Dear <span className="not-italic font-semibold text-sakura-rose">{inviteeName}</span>, you are cordially invited
            </motion.p>
          )}

          <div className="flex-[3]" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white flex flex-col items-center gap-1 drop-shadow"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] font-sans">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}

function Couple() {
  const people = [
    { role: 'The Groom', ...WEDDING.groom },
    { role: 'The Bride', ...WEDDING.bride },
  ];
  return (
    <section className="relative py-24 sm:py-32 px-6 bg-sakura-ivory overflow-hidden">
      <Flower className="absolute -top-6 -left-8 w-32 opacity-30 rotate-12" />
      <Flower className="absolute -bottom-8 -right-6 w-40 opacity-25 -rotate-12" />

      <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-14">
        <SectionLabel>The Couple</SectionLabel>
        <p className="font-serif italic text-xl sm:text-2xl text-sakura-plum leading-relaxed">
          “Like cherry blossoms in spring, love blooms gently and beautifully — and we would love you to witness ours.”
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">
        {people.map((p, i) => (
          <motion.div
            key={p.role}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.15 }}
            className="relative rounded-[2rem] bg-white/80 border border-sakura-pink/60 shadow-[0_20px_50px_rgba(184,92,116,0.10)] px-8 py-12 text-center"
          >
            <Flower className="w-12 h-12 mx-auto -mt-[4.5rem] mb-6 drop-shadow" />
            <span className="uppercase tracking-[0.4em] text-[10px] font-semibold text-sakura-deep font-sans">{p.role}</span>
            <h3 className="font-display text-6xl text-sakura-deep mt-3 mb-4">{p.name}</h3>
            <span className="block h-px w-16 mx-auto bg-sakura-pink mb-4" />
            <p className="font-serif italic text-lg text-sakura-plum/80">{p.parents}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Details() {
  return (
    <section className="relative py-20 sm:py-28 px-4 bg-gradient-to-b from-sakura-ivory to-sakura-blush overflow-hidden">
      <motion.div {...reveal} className="text-center mb-8">
        <SectionLabel>The Wedding Day</SectionLabel>
      </motion.div>

      {/* Card drawn on the sakura frame image */}
      <motion.div
        {...reveal}
        className="relative mx-auto w-full max-w-[440px] text-center drop-shadow-[0_25px_40px_rgba(184,92,116,0.18)]"
        style={{ backgroundImage: `url("${IMG.frame}")`, backgroundSize: '100% 100%', minHeight: 'min(782px, calc((100vw - 2rem) * 1.778))' }}
      >
        <div className="px-[15%] pt-[24%] pb-[22%] flex flex-col items-center">
          <p className="font-display text-4xl sm:text-5xl text-sakura-deep mb-1">Save the Date</p>
          <span className="block h-px w-16 bg-sakura-deep/30 my-4" />

          <Calendar className="w-5 h-5 text-sakura-deep mb-2" />
          <p className="font-serif text-xl sm:text-2xl text-sakura-plum font-semibold">{WEDDING.dateText}</p>

          <MapPin className="w-5 h-5 text-sakura-deep mt-6 mb-2" />
          <p className="font-serif text-lg sm:text-xl text-sakura-plum font-semibold leading-snug">{WEDDING.venue.name}</p>
          <p className="font-serif italic text-base text-sakura-plum/80">{WEDDING.venue.hall}</p>
          <p className="font-sans uppercase tracking-[0.3em] text-[10px] text-sakura-plum/60 mt-1">{WEDDING.venue.city}</p>

          <Clock className="w-5 h-5 text-sakura-deep mt-6 mb-3" />
          <ul className="w-full space-y-2">
            {WEDDING.schedule.map((s) => (
              <li key={s.label} className="flex items-baseline gap-2 font-serif text-base sm:text-lg text-sakura-plum">
                <span className="text-left">{s.label}</span>
                <span className="flex-1 border-b border-dotted border-sakura-deep/30 translate-y-[-4px]" />
                <span className="font-semibold whitespace-nowrap">{s.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

function CountdownSection({ target }: { target: Date }) {
  const [left, setLeft] = useState({ Days: 0, Hours: 0, Minutes: 0, Seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, target.getTime() - Date.now());
      setLeft({
        Days: Math.floor(d / 86400000),
        Hours: Math.floor((d / 3600000) % 24),
        Minutes: Math.floor((d / 60000) % 60),
        Seconds: Math.floor((d / 1000) % 60),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);

  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
      <img src={IMG.bloomsBg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-sakura-blush via-white/20 to-white/10" />

      <motion.div {...reveal} className="relative z-10 text-center">
        <SectionLabel>Counting the Days</SectionLabel>
        <p className="font-display text-5xl sm:text-6xl text-sakura-deep mb-10">Until We Say “I Do”</p>

        <div className="grid grid-cols-4 gap-2 sm:gap-5 max-w-xl mx-auto">
          {Object.entries(left).map(([label, value]) => (
            <div key={label} className="rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-md border border-white shadow-[0_10px_30px_rgba(184,92,116,0.15)] py-4 sm:py-6">
              <p className="font-serif text-3xl sm:text-5xl text-sakura-deep tabular-nums">{String(value).padStart(2, '0')}</p>
              <p className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] text-sakura-plum font-sans mt-1">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Venue() {
  return (
    <section className="relative py-24 sm:py-32 px-6 bg-sakura-ivory overflow-hidden">
      <motion.div {...reveal} className="text-center mb-12">
        <SectionLabel>The Venue</SectionLabel>
        <h2 className="font-display text-5xl sm:text-6xl text-sakura-deep">Where Love Blooms</h2>
      </motion.div>

      <motion.div
        {...reveal}
        className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden bg-white shadow-[0_25px_60px_rgba(184,92,116,0.15)] border border-sakura-pink/50 grid md:grid-cols-2"
      >
        <div className="relative aspect-[4/3] md:aspect-auto">
          <img src={WEDDING.venue.imageUrl} alt={WEDDING.venue.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="relative p-8 sm:p-12 text-center md:text-left flex flex-col justify-center">
          <Flower className="absolute top-4 right-4 w-10 opacity-70" />
          <p className="uppercase tracking-[0.35em] text-[10px] text-sakura-deep font-semibold font-sans mb-3">{WEDDING.venue.hall}</p>
          <h3 className="font-serif text-3xl sm:text-4xl text-sakura-plum font-semibold leading-tight">{WEDDING.venue.name}</h3>
          <p className="font-sans uppercase tracking-[0.3em] text-[10px] text-sakura-plum/60 mt-2">{WEDDING.venue.city}</p>
          <p className="font-serif italic text-lg text-sakura-plum/80 mt-6 leading-relaxed">{WEDDING.venue.quote}</p>
          <a
            href={WEDDING.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 self-center md:self-start inline-flex items-center gap-2 rounded-full bg-sakura-deep text-white px-7 py-3 text-xs uppercase tracking-[0.25em] font-sans shadow-lg shadow-sakura-deep/25 hover:bg-sakura-plum transition-colors"
          >
            <Navigation className="w-4 h-4" /> Open in Maps
          </a>
        </div>
      </motion.div>
    </section>
  );
}

const inputCls =
  'w-full rounded-2xl border border-sakura-pink bg-white/80 px-5 py-3.5 font-serif text-lg text-sakura-plum placeholder:text-sakura-plum/40 focus:outline-none focus:ring-2 focus:ring-sakura-deep/30 focus:border-sakura-deep/50 transition';

async function postToSheet(fields: Record<string, string>) {
  const payload = new FormData();
  Object.entries(fields).forEach(([k, v]) => payload.append(k, v));
  await fetch(WEDDING.formsScriptUrl, { method: 'POST', mode: 'no-cors', body: payload });
}

function Rsvp({ inviteeName, eventParam }: { inviteeName: string; eventParam: string }) {
  const [fullName, setFullName] = useState(inviteeName);
  const [guests, setGuests] = useState('1');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => setFullName(inviteeName), [inviteeName]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setStatus('loading');
    try {
      await postToSheet({ sheet: 'RSVP', fullName: fullName.trim(), guests, event: eventParam });
      setStatus('done');
      toast.success('Your RSVP has been warmly received!');
    } catch {
      setStatus('idle');
      toast.error('Could not submit RSVP. Please try again.');
    }
  };

  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
      <img src={IMG.petalsBg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-sakura-ivory via-white/40 to-sakura-ivory" />

      <motion.div {...reveal} className="relative z-10 max-w-lg mx-auto rounded-[2.5rem] bg-white/85 backdrop-blur-xl border border-white shadow-[0_30px_70px_rgba(184,92,116,0.18)] px-6 sm:px-12 py-12 text-center">
        <Flower className="w-14 h-14 mx-auto -mt-[4.75rem] mb-6 drop-shadow-md" />
        <SectionLabel>Kindly Respond</SectionLabel>
        <h2 className="font-display text-5xl sm:text-6xl text-sakura-deep mb-3">Will You Join Us?</h2>
        <p className="font-serif italic text-lg text-sakura-plum/80 mb-8">Your presence would make our day complete.</p>

        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
              <CheckCircle className="w-12 h-12 text-sakura-deep mx-auto mb-4" />
              <p className="font-display text-4xl text-sakura-deep">Thank you!</p>
              <p className="font-serif italic text-lg text-sakura-plum/80 mt-2">We can’t wait to celebrate with you.</p>
              <button onClick={() => setStatus('idle')} className="mt-6 text-xs uppercase tracking-[0.25em] text-sakura-deep/70 underline font-sans">
                Send another response
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <label className="block">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-sakura-deep font-sans mb-2 ml-2">Full name</span>
                <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required />
              </label>
              <label className="block">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-sakura-deep font-sans mb-2 ml-2">Number of guests</span>
                <select className={inputCls} value={guests} onChange={(e) => setGuests(e.target.value)}>
                  {['1', '2', '3', '4', '5'].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === '1' ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full mt-2 rounded-full bg-sakura-deep text-white py-4 text-xs uppercase tracking-[0.3em] font-sans shadow-lg shadow-sakura-deep/25 hover:bg-sakura-plum transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm Attendance
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

interface Wish {
  id: string;
  name: string;
  message: string;
}

function Wishes({ inviteeName, eventParam }: { inviteeName: string; eventParam: string }) {
  const [name, setName] = useState(inviteeName);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => setName(inviteeName), [inviteeName]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      await postToSheet({ sheet: 'WISH', name: name.trim(), message: message.trim(), event: eventParam });
      setWishes((w) => [{ id: String(Date.now()), name: name.trim(), message: message.trim() }, ...w]);
      setMessage('');
      toast.success('Your blessing has been shared!');
    } catch {
      toast.error('Could not send your wishes. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 px-4 bg-sakura-ivory overflow-hidden">
      <Flower className="absolute top-10 -right-10 w-36 opacity-25 rotate-45" />
      <motion.div {...reveal} className="text-center mb-10">
        <SectionLabel>Blessings</SectionLabel>
        <h2 className="font-display text-5xl sm:text-6xl text-sakura-deep">Leave Us a Wish</h2>
      </motion.div>

      <motion.form {...reveal} onSubmit={submit} className="max-w-lg mx-auto space-y-4">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        <textarea className={`${inputCls} min-h-[130px] resize-none`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your blessing for the couple…" required />
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-full border border-sakura-deep text-sakura-deep py-4 text-xs uppercase tracking-[0.3em] font-sans hover:bg-sakura-deep hover:text-white transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send Blessing
        </button>
      </motion.form>

      <div className="max-w-lg mx-auto mt-10 space-y-4">
        <AnimatePresence initial={false}>
          {wishes.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl bg-white border border-sakura-pink/60 px-6 py-5 shadow-sm"
            >
              <Flower className="absolute -top-3 -left-3 w-8" />
              <p className="font-serif italic text-lg text-sakura-plum leading-relaxed">“{w.message}”</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-sakura-deep font-sans">— {w.name}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative pt-24 pb-12 px-6 text-center overflow-hidden">
      <img src={IMG.bloomsBg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-bottom" />
      <div className="absolute inset-0 bg-gradient-to-b from-sakura-ivory via-white/30 to-transparent" />
      <div className="relative z-10">
        <Flower className="w-14 h-14 mx-auto mb-4 drop-shadow" />
        <p className="font-serif italic text-lg text-sakura-plum/80">With love and gratitude,</p>
        <p className="font-display text-6xl sm:text-7xl text-sakura-deep my-3">{COUPLE_NAMES}</p>
        <p className="uppercase tracking-[0.4em] text-[10px] sm:text-xs text-sakura-plum font-sans">{WEDDING.dateText}</p>
        <p className="mt-24 text-[9px] sm:text-[10px] uppercase tracking-widest text-sakura-plum/80 font-sans">
          Want a beautiful wedding website like this? Create yours with{' '}
          <a target="_blank" rel="noreferrer" href="https://wa.me/94707819074" className="font-bold underline text-sakura-deep">
            invitemint
          </a>
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------- page */

export function SakuraInvitation({ active, eventParam, fullInviteeName, weddingDate, isMusicPlaying, onToggleMusic }: SakuraInvitationProps) {
  if (!active) return null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-sakura-ivory text-sakura-plum font-sans selection:bg-sakura-pink/60 overflow-x-hidden"
    >
      <button
        onClick={onToggleMusic}
        aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
        className="fixed top-5 right-5 z-50 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-sakura-pink shadow-[0_8px_25px_rgba(184,92,116,0.2)] flex items-center justify-center text-sakura-deep hover:scale-105 transition"
      >
        {isMusicPlaying ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      <FallingSakura />
      <Hero inviteeName={fullInviteeName} />
      <Couple />
      <Details />
      <CountdownSection target={weddingDate} />
      <Venue />
      <Rsvp inviteeName={fullInviteeName} eventParam={eventParam} />
      <Wishes inviteeName={fullInviteeName} eventParam={eventParam} />
      <Footer />
    </motion.main>
  );
}
