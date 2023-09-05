function PersonCall({ stream }) {
  return (
    <div>
      <div>
        <h2>Your Video</h2>
        <video
          srcObject={stream}
          autoPlay
          style={{ width: '300px', height: 'auto' }}
        />
      </div>
    </div>
  );
}

export default PersonCall;
