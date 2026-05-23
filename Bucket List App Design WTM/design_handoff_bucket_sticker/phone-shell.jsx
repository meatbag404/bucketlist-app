// Bucket — interactive phone shell + design canvas page.

// PhoneShell — full iPhone bezel with the chosen screen inside.
// `nav` is { tab, screen, bucketId, itemId } so we can support both bottom-tab
// switching and modal-style deep links (bucket → item).
function PhoneShell({ width = 393, height = 852, theme, initial = 'home', framed = true }) {
  const [nav, setNav] = React.useState({ tab: 'home', screen: initial, bucketId: 'b1', itemId: 'i2' });

  function go(patch) { setNav(n => ({ ...n, ...patch })); }
  function setTab(tab) {
    if (tab === 'add') return go({ screen: 'add' });
    if (tab === 'home') return go({ tab, screen: 'home' });
    if (tab === 'activity') return go({ tab, screen: 'activity' });
    if (tab === 'memories') return go({ tab, screen: 'memories' });
    if (tab === 'friends') return go({ tab, screen: 'friends' });
  }

  const dark = theme.bg === '#15131A';

  let content;
  if (nav.screen === 'home')     content = <ScreenBuckets theme={theme} onOpenBucket={id => go({ screen: 'bucket', bucketId: id })} />;
  else if (nav.screen === 'bucket')   content = <ScreenBucket theme={theme} bucketId={nav.bucketId} onBack={() => go({ screen: 'home' })} onOpenItem={id => go({ screen: 'item', itemId: id })} onAdd={() => go({ screen: 'add' })} />;
  else if (nav.screen === 'item')     content = <ScreenItem theme={theme} itemId={nav.itemId} onBack={() => go({ screen: 'bucket' })} onDone={() => go({ screen: 'bucket' })} />;
  else if (nav.screen === 'add')      content = <ScreenAdd theme={theme} onCancel={() => go({ screen: nav.tab === 'home' ? 'home' : nav.tab })} onAdd={() => go({ screen: nav.tab === 'home' ? 'home' : nav.tab })} />;
  else if (nav.screen === 'memories') content = <ScreenMemories theme={theme} onOpenItem={() => go({ screen: 'item', itemId: 'i2' })} />;
  else if (nav.screen === 'activity') content = <ScreenActivity theme={theme} />;
  else if (nav.screen === 'friends')  content = <ScreenFriends theme={theme} />;

  // Top padding so content clears the dynamic island/status bar where the
  // screen doesn't render its own full-bleed hero.
  const needsTopSpace = ['home', 'memories', 'activity', 'friends'].includes(nav.screen);

  const inner = (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: theme.bg, overflow: 'hidden',
      borderRadius: framed ? 44 : 0,
    }}>
      {/* status bar always on top */}
      <PHStatusBar theme={theme} />
      <PHDynamicIsland />
      <div style={{
        position: 'absolute', inset: 0,
        paddingTop: needsTopSpace ? 54 : 0,
        overflow: 'auto',
      }}>
        {content}
      </div>
      {nav.screen !== 'add' && <PHTabBar tab={nav.tab} onTab={setTab} theme={theme} />}
      <PHHomeIndicator dark={dark} />
    </div>
  );

  if (!framed) return inner;

  return (
    <div style={{
      width, height,
      background: '#000', borderRadius: 52, padding: 5,
      boxShadow: '0 30px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.18)',
      position: 'relative', boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 47, overflow: 'hidden', position: 'relative' }}>
        {inner}
      </div>
    </div>
  );
}

// Static screen — single screen with no nav state, used for the canvas artboards.
function StaticPhone({ screen, theme, bucketId = 'b1', itemId = 'i2', width = 393, height = 852 }) {
  const noop = () => {};
  let content;
  if (screen === 'home')      content = <ScreenBuckets theme={theme} onOpenBucket={noop} />;
  else if (screen === 'bucket')   content = <ScreenBucket theme={theme} bucketId={bucketId} onBack={noop} onOpenItem={noop} onAdd={noop} />;
  else if (screen === 'item')     content = <ScreenItem theme={theme} itemId={itemId} onBack={noop} onDone={noop} />;
  else if (screen === 'add')      content = <ScreenAdd theme={theme} onCancel={noop} onAdd={noop} />;
  else if (screen === 'memories') content = <ScreenMemories theme={theme} onOpenItem={noop} />;
  else if (screen === 'activity') content = <ScreenActivity theme={theme} />;
  else if (screen === 'friends')  content = <ScreenFriends theme={theme} />;

  const needsTopSpace = ['home', 'memories', 'activity', 'friends'].includes(screen);
  const dark = theme.bg === '#15131A';

  return (
    <div style={{
      width, height,
      background: '#000', borderRadius: 52, padding: 5,
      boxShadow: '0 24px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.14)',
      position: 'relative', boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 47, overflow: 'hidden',
        position: 'relative', background: theme.bg,
      }}>
        <PHStatusBar theme={theme} />
        <PHDynamicIsland />
        <div style={{
          position: 'absolute', inset: 0,
          paddingTop: needsTopSpace ? 54 : 0,
          overflow: 'auto',
        }}>
          {content}
        </div>
        {screen !== 'add' && <PHTabBar tab={screen === 'item' ? 'home' : screen === 'bucket' ? 'home' : screen} onTab={() => {}} theme={theme} />}
        <PHHomeIndicator dark={dark} />
      </div>
    </div>
  );
}

Object.assign(window, { PhoneShell, StaticPhone });
