function LocalPerson({ stream }) {
  return (
    <div>
      <h2>Your Video</h2>
      <video
        srcObject={stream}
        autoPlay
        muted
        style={{ width: '300px', height: 'auto' }}
      />
    </div>
  );
}

export default LocalPerson;
