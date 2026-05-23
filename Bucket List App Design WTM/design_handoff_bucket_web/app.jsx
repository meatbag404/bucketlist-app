// Bucket List — root.

function App() {
  const vp = useViewport();
  const [route, navigate] = useRoute('buckets');
  // Pass picked icon across the add ↔ icons flow.
  const [pickedIcon, setPickedIcon] = React.useState(null);

  // Pre-app screens that bypass AppShell (no sidebar / no bottom nav).
  if (route.screen === 'login') {
    return <ScreenLogin navigate={navigate} vp={vp} />;
  }

  const KNOWN = ['buckets','bucket','item','add','memories','activity','friends','icons'];
  if (!KNOWN.includes(route.screen)) {
    return <Screen404 navigate={navigate} vp={vp} />;
  }

  // Map screen → content.
  let content;
  if (route.screen === 'buckets')       content = <ScreenBuckets navigate={navigate} vp={vp} />;
  else if (route.screen === 'bucket')   content = <ScreenBucket bucketId={route.id || 'b1'} navigate={navigate} vp={vp} />;
  else if (route.screen === 'item')     content = <ScreenItem itemId={route.id || 'i2'} navigate={navigate} vp={vp} />;
  else if (route.screen === 'add')      content = <ScreenAdd navigate={navigate} vp={vp} pickedIcon={pickedIcon} />;
  else if (route.screen === 'memories') content = <ScreenMemories navigate={navigate} vp={vp} />;
  else if (route.screen === 'activity') content = <ScreenActivity navigate={navigate} vp={vp} />;
  else if (route.screen === 'friends')  content = <ScreenFriends navigate={navigate} vp={vp} />;
  else if (route.screen === 'icons')    content = <ScreenIcons navigate={navigate} vp={vp} onPick={setPickedIcon} />;

  return (
    <AppShell route={route} navigate={navigate} vp={vp}>
      {content}
    </AppShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
