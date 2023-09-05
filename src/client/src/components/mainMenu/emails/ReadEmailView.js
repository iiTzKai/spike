import { useSelector } from 'react-redux';

function ReadEmailView() {
  const emailread = useSelector((state) => state.emailHolder.readEmail);

  return (
    <div className="email-view-container">
      <div className="card">
        <span className="card__title">
          {emailread ? emailread.subject : null}
        </span>
        <p className="card__text">{emailread ? emailread.content : null}</p>
      </div>
    </div>
    // <div className="email-view-container">
    //   <div class="email-paper">
    //     <p>Subject: {emailread ? emailread.subject : null}</p>
    //     <p>From: {emailread ? emailre    ad.sender : null}</p>
    //     <p>{emailread ? emailread.content : null}</p>
    //   </div>
    // </div>
  );
}

export default ReadEmailView;
