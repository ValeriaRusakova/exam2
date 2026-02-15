import Navigation from '../components/Navigation';
import './About.css';

function About() {
  return (
    <div className="page">
      <h1>אודות</h1>
      <Navigation />
      
      <div className="content about-content">
        <section className="about-section">
          <h2>על האתר</h2>
          <p>
            אתר זה מציג מידע עדכני על מזג האוויר ביישובים השונים בישראל.
            האתר מאפשר למשתמשים לבחור יישוב ולקבל מידע מפורט על מזג האוויר
            הנוכחי, כולל טמפרטורה, תיאור מזג האוויר ומהירות הרוח.
          </p>
          <p>
            המידע מתקבל מ-API חיצוני המספק נתוני מזג אוויר בזמן אמת,
            ורשימת היישובים נלקחת ממאגרי המידע הממשלתיים.
          </p>
        </section>

        <section className="developer-section">
          <h2>על המפתחת</h2>
          <div className="developer-info">
            <p><strong>שם:</strong> ולריה רוסקובה</p>
            <p><strong>תעודת זהות:</strong> 321469512</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
