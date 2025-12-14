'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';

const SECTIONS = ['home', 'story', 'events', 'gallery', 'wishes', 'rsvp', 'gift'];

export default function Page() {
  const searchParams = useSearchParams();
  const guestParam = searchParams.get('to');
  const guestName = guestParam || 'Bapak/Ibu/Saudara/i Tamu Istimewa';

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const [wishName, setWishName] = useState('');
  const [wishText, setWishText] = useState('');
  const [wishes, setWishes] = useState([]);
  const [wishesLoading, setWishesLoading] = useState(true);
  const [wishSubmitting, setWishSubmitting] = useState(false);

  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  // Gallery images state with default images from local public folder
  const defaultGalleryImages = [
    '/images/gallery/1.png',
    '/images/gallery/6.png',
    '/images/gallery/2.jpeg',
    '/images/gallery/3.jpeg',
    '/images/gallery/4.jpeg',
    '/images/gallery/5.jpeg',
  ];

  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);

  // Load gallery images from localStorage on mount
  useEffect(() => {
    const storedImages = localStorage.getItem('weddingGalleryImages');
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setGalleryImages(parsedImages);
        }
      } catch (error) {
        console.error('Error loading gallery images from localStorage:', error);
      }
    }
  }, []);

  // Save gallery images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weddingGalleryImages', JSON.stringify(galleryImages));
  }, [galleryImages]);

  // Countdown
  useEffect(() => {
    const targetDate = new Date('2025-12-24T10:00:00+07:00').getTime();

    const update = () => {
      const now = Date.now();
      let diff = targetDate - now;
      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Active nav on scroll + smooth reveal
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 4;
      let current = 'home';

      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    // Section reveal
    const sections = document.querySelectorAll('.section-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener('scroll', onScroll);
      sections.forEach((sec) => observer.unobserve(sec));
      observer.disconnect();
    };
  }, []);

  // Fetch wishes from Supabase on mount
  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setWishes(data || []);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setWishesLoading(false);
    }
  };

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!wishName.trim() || !wishText.trim()) return;

    setWishSubmitting(true);
    try {
      const { error } = await supabase
        .from('wishes')
        .insert([{ name: wishName.trim(), text: wishText.trim() }]);

      if (error) throw error;

      // Refetch wishes to get the updated list
      await fetchWishes();
      setWishName('');
      setWishText('');
    } catch (error) {
      console.error('Error submitting wish:', error);
      alert('Gagal mengirim ucapan. Silakan coba lagi.');
    } finally {
      setWishSubmitting(false);
    }
  };

  const handleSubmitRsvp = async (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpStatus) return;

    setRsvpSubmitting(true);
    try {
      const { error } = await supabase
        .from('rsvps')
        .insert([{ name: rsvpName.trim(), status: rsvpStatus }]);

      if (error) throw error;

      setRsvpSuccess(true);
      setRsvpName('');
      setRsvpStatus('');
      setTimeout(() => setRsvpSuccess(false), 6000);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Gagal mengirim konfirmasi. Silakan coba lagi.');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handleCopy = (text) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMusic = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play().catch(err => console.log('Audio play failed:', err));
        setIsPlaying(true);
      }
    }
  };

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio('/music/background.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Set volume to 30%
    setAudioElement(audio);

    // Cleanup on unmount
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero section-reveal" id="home">
        <div className="hero-inner">
          <div className="hero-subtitle">Undangan Pernikahan</div>
          <h1 className="hero-names">Nova &amp; Hasan</h1>
          <div className="hero-divider"></div>
          <div className="hero-date">Sabtu, 24 Desember 2025 • Purwokerto</div>

          <div className="hero-quote">
            “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
            untukmu pasangan dari jenismu sendiri, agar kamu cenderung dan
            merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
            kasih dan sayang.”
          </div>

          <div className="hero-countdown" id="countdown">
            <div className="count-box">
              <div className="count-number" id="days">{countdown.days}</div>
              <div className="count-label">Hari</div>
            </div>
            <div className="count-box">
              <div className="count-number" id="hours">{countdown.hours}</div>
              <div className="count-label">Jam</div>
            </div>
            <div className="count-box">
              <div className="count-number" id="minutes">{countdown.minutes}</div>
              <div className="count-label">Menit</div>
            </div>
            <div className="count-box">
              <div className="count-number" id="seconds">{countdown.seconds}</div>
              <div className="count-label">Detik</div>
            </div>
          </div>

          <button className="hero-button" onClick={() => scrollToSection('rsvp')}>
            Konfirmasi Kehadiran
          </button>

          <div className="invite-card">
            Kepada Yth. <span id="guestName">{guestName}</span>
          </div>
        </div>
      </section>

      {/* ABOUT / COUPLE */}
      <section id="story" className="section-alt section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Mempelai</small>
            <h2>Tentang Kami</h2>
            <p>
              Dengan segala rasa syukur, kami dipertemukan dan dipersatukan
              hingga pada akhirnya memantapkan hati untuk melangkah ke jenjang pernikahan.
            </p>
          </div>

          <div className="story-grid">
            <div className="story-text">
              <p>
                Kami percaya bahwa setiap pertemuan bukanlah sebuah kebetulan.
                Dalam perjalanan ini, kami belajar untuk saling menguatkan,
                saling menerima, dan saling mendewasakan.
              </p>
              <p>
                <span className="story-highlight">
                  Cinta bagi kami adalah pulang ke orang yang sama, setiap hari,
                  dengan hati yang tetap tenang.
                </span>
              </p>
              <p>
                Melalui pernikahan ini, kami ingin membangun rumah kecil yang
                dipenuhi dengan doa, tawa, dan rasa syukur. Kami sangat berbahagia
                apabila Bapak/Ibu/Saudara/i berkenan hadir menjadi saksi langkah awal kami.
              </p>
            </div>

            <div className="story-couple">
              <div className="story-card">
                <div className="couple-photo">
                  <img src="/images/couple/bride.jpeg" alt="Dwi Nova Fitriani" />
                </div>
                <h3>Dwi Nova Fitriani</h3>
                <span>Calon Mempelai Wanita</span>
                <p>
                  Lembut, hangat, dan penuh perhatian. Ia percaya bahwa kebahagiaan
                  dapat ditemukan dalam hal-hal sederhana: secangkir kopi di pagi hari,
                  pesan singkat yang menenangkan, dan doa yang tak pernah putus.
                </p>
              </div>
              <div className="story-card" >
                <div className="couple-photo">
                  <img src="/images/couple/groom.jpeg" alt="Hasan" />
                </div>
                <h3>Hasan</h3>
                <span>Calon Mempelai Pria</span>
                <p>
                  Tenang, sabar, dan penuh humor. Ia percaya bahwa cinta sejati adalah
                  komitmen untuk terus memilih orang yang sama, dalam suka maupun duka,
                  setiap hari sepanjang hidup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY TIMELINE
      <section id="timeline" className="section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Cerita Kita</small>
            <h2>Our Story</h2>
            <p>
              Beberapa momen kecil yang menjadi bagian penting dari perjalanan kami hingga hari ini.
            </p>
          </div>

          <div className="timeline">
            <div className="timeline-item left">
              <div className="timeline-marker">❤</div>
              <div className="timeline-card">
                <img
                  src="/images/timeline/first-meet.jpg"
                  alt="Pertama Bertemu"
                />
                <div className="timeline-content">
                  <div className="timeline-date">Juni 2022</div>
                  <div className="timeline-title">Pertama Bertemu</div>
                  <div className="timeline-text">
                    Kami berkenalan melalui teman yang sama dan langsung merasa
                    nyaman satu sama lain. Saat itu kami belum tahu bahwa
                    pertemuan sederhana itu akan menjadi awal dari selamanya.
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-item right">
              <div className="timeline-marker">❤</div>
              <div className="timeline-card">
                <img
                  src="/images/timeline/engagement.jpg"
                  alt="Lamaran"
                />
                <div className="timeline-content">
                  <div className="timeline-date">Desember 2023</div>
                  <div className="timeline-title">Lamaran</div>
                  <div className="timeline-text">
                    Di bawah langit malam yang tenang, dengan doa dan niat yang baik,
                    ia mengungkapkan keinginan untuk melangkah lebih jauh.
                    Jawabannya adalah “iya”, dengan hati yang penuh syukur.
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-item left">
              <div className="timeline-marker">❤</div>
              <div className="timeline-card">
                <img
                  src="/images/timeline/wedding-day.jpg"
                  alt="Hari Pernikahan"
                />
                <div className="timeline-content">
                  <div className="timeline-date">Desember 2025</div>
                  <div className="timeline-title">Hari Pernikahan</div>
                  <div className="timeline-text">
                    Kami memulai babak baru sebagai suami dan istri, dikelilingi oleh
                    keluarga dan sahabat yang kami cintai. Semoga hari ini menjadi
                    doa baik yang akan terus mengiringi langkah kami ke depan.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* EVENTS */}
      <section id="events" className="section-alt section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Rangkaian Acara</small>
            <h2>Hari Bahagia</h2>
            <p>
              Dalam satu pandang, berikut informasi acara, waktu, dan lokasi
              pernikahan kami.
            </p>
          </div>

          <div className="event-wrapper">
            <div className="event-main-card">
              <div style={{ textAlign: 'center' }}>
                <span className="event-badge">Detail Acara</span>
              </div>
              <h3>Akad &amp; Resepsi Pernikahan</h3>

              <div className="event-rows">
                <div className="event-row">
                  <div className="event-detail-label">📅 Tanggal</div>
                  <div className="event-detail-value">Sabtu, 24 Desember 2025</div>

                  <div className="event-detail-label">⏰ Waktu</div>
                  <div className="event-detail-value">10.00 WIB - Selesai</div>

                  <div className="event-detail-label">📍 Lokasi</div>
                  <div className="event-detail-value">
                    KUA Baturaden
                    <br />
                    Jl. Sidaluhur, RT. 02 RW. 05
                    <br />
                    Desa Rempoah, Kecamatan Baturraden
                  </div>
                </div>
              </div>

              <div className="event-note">
                Kami sangat berharap Bapak/Ibu/Saudara/i dapat hadir dan memberikan doa terbaik
                bagi kami berdua.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Galeri</small>
            <h2>Jejak Kenangan</h2>
            <p>
              Beberapa rekaman momen yang kami abadikan sebagai saksi kecil
              perjalanan cinta ini.
            </p>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((imageUrl, index) => (
              <div className="gallery-item" key={index}>
                <img
                  src={`${imageUrl}?t=${Date.now()}`}
                  alt={`Galeri ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="section-alt section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Lokasi Acara</small>
            <h2>Tempat Berbahagia</h2>
            <p>
              Berikut lokasi acara pernikahan kami. Semoga perjalanan Anda
              menuju tempat ini dimudahkan dan dilancarkan.
            </p>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.864642739878!2d109.2409284!3d-7.369065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655f76eb41ae85%3A0x42dbfb8486b1009a!2sJl.%20Sidaluhur%2C%20Rempoah%2C%20Kec.%20Baturaden%2C%20Kabupaten%20Banyumas%2C%20Jawa%20Tengah!5e0!3m2!1sen!2sid!4v1765699073719!5m2!1sen!2sid"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi pernikahan"
          />
          <div className="location-details">
            <b>KUA Baturaden</b>
            <br />
            Jl. Sidaluhur, RT. 02 RW. 05<br /> Desa Rempoah, Kecamatan Baturraden
          </div>
        </div>
      </section>

      {/* WISHES & PRAYERS */}
      <section id="wishes" className="section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Harapan</small>
            <h2>Doa &amp; Ucapan</h2>
            <p>
              Tinggalkan doa terbaik dan ucapan hangat untuk kami berdua di hari istimewa ini.
            </p>
          </div>

          <div className="wishes-layout">
            <div className="wishes-form-card">
              <h3>Tulis Ucapan</h3>
              <form onSubmit={handleSubmitWish}>
                <div className="form-group">
                  <label htmlFor="wishName">Nama Anda *</label>
                  <input
                    id="wishName"
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="wishText">Ucapan / Doa *</label>
                  <textarea
                    id="wishText"
                    rows={3}
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    required
                    placeholder="Tulis ucapan atau doa terbaik Anda di sini..."
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={wishSubmitting}>
                  {wishSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
              </form>

              <div className="wishes-list" style={{ maxHeight: '500px', minHeight: '200px', overflowY: 'auto' }}>
                {wishesLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                    Memuat ucapan...
                  </div>
                ) : wishes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                    Belum ada ucapan. Jadilah yang pertama! 💌
                  </div>
                ) : (
                  wishes.map((w, i) => (
                    <div className="wish-item" key={w.id || i}>
                      <div className="wish-name">{w.name}</div>
                      <div className="wish-text">{w.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="section-alt section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Konfirmasi Kehadiran</small>
            <h2>RSVP</h2>
            <p>
              Mohon kesediaannya untuk mengonfirmasi apakah Bapak/Ibu/Saudara/i
              dapat hadir atau tidak pada hari pernikahan kami.
            </p>
          </div>

          <div className="rsvp-form">
            <h3>Formulir Singkat</h3>
            <form onSubmit={handleSubmitRsvp}>
              <div className="form-group">
                <label htmlFor="rsvpName">Nama Lengkap *</label>
                <input
                  id="rsvpName"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rsvpStatus">Kehadiran *</label>
                <select
                  id="rsvpStatus"
                  value={rsvpStatus}
                  onChange={(e) => setRsvpStatus(e.target.value)}
                  required
                >
                  <option value="">Pilih status</option>
                  <option value="hadir">Saya akan hadir</option>
                  <option value="tidak-hadir">Maaf, saya tidak dapat hadir</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={rsvpSubmitting}>
                {rsvpSubmitting ? 'Mengirim...' : 'Kirim'}
              </button>

              <div className="rsvp-message">
                Data kehadiran ini akan kami gunakan untuk penataan tempat dan konsumsi.
              </div>

              {rsvpSuccess && (
                <div className="rsvp-success">
                  Terima kasih! Konfirmasi kehadiran Anda telah kami terima.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* WEDDING GIFT */}
      <section id="gift" className="section-reveal">
        <div className="section-inner">
          <div className="section-heading">
            <small>Wedding Gift</small>
            <h2>Hadiah Pernikahan</h2>
            <p>
              Kehadiran dan doa Anda merupakan hadiah terindah bagi kami. Namun,
              apabila ingin mengirimkan tanda kasih, berikut beberapa informasi yang dapat digunakan.
            </p>
          </div>

          <div className="gift-cards">
            <div className="gift-card">
              <div className="gift-icon"><img src="/images/GoPay Logogram_Blue.png" alt="GoPay" style={{ width: '35px' }} /></div>
              <div className="gift-title">GoPay</div>
              <div className="gift-name">a.n. Hasan</div>
              <div className="gift-number">0895332336140</div>
              <button
                type="button"
                className="btn-copy"
                onClick={() => handleCopy('0895332336140')}
              >
                📋 Copy
              </button>
            </div>

            <div className="gift-card">
              <div className="gift-icon"><img src="/images/01-Mandiri Master Brand Logo.png" alt="Mandiri" style={{ width: '35px' }} /></div>
              <div className="gift-title">Mandiri</div>
              <div className="gift-name">a.n. Hasan</div>
              <div className="gift-number">0987654321</div>
              <button
                type="button"
                className="btn-copy"
                onClick={() => handleCopy('0987654321')}
              >
                📋 Copy
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        Dengan penuh cinta,
        <br />
        <strong>Nova &amp; Hasan</strong>
        <div className="footer-divider"></div>
        <div>© 2025 • Keluarga Besar Nova &amp; Hasan</div>
      </footer>

      {/* BOTTOM NAVBAR */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          <button
            type="button"
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => scrollToSection('home')}
          >
            <span className="nav-icon">🏡</span>
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === 'story' ? 'active' : ''}`}
            onClick={() => scrollToSection('story')}
          >
            <span className="nav-icon">👩‍❤️‍👨</span>
            <span>Couple</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === 'events' ? 'active' : ''}`}
            onClick={() => scrollToSection('events')}
          >
            <span className="nav-icon">📅</span>
            <span>Events</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === 'gallery' ? 'active' : ''}`}
            onClick={() => scrollToSection('gallery')}
          >
            <span className="nav-icon">📷</span>
            <span>Gallery</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === 'wishes' ? 'active' : ''}`}
            onClick={() => scrollToSection('wishes')}
          >
            <span className="nav-icon">💌</span>
            <span>Wishes</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === 'rsvp' ? 'active' : ''}`}
            onClick={() => scrollToSection('rsvp')}
          >
            <span className="nav-icon">✅</span>
            <span>RSVP</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === 'gift' ? 'active' : ''}`}
            onClick={() => scrollToSection('gift')}
          >
            <span className="nav-icon">🎁</span>
            <span>Gift</span>
          </button>
        </div>
      </nav>

      {/* FLOATING MUSIC BUTTON */}
      <button
        onClick={toggleMusic}
        className="music-button"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </>
  );
}
