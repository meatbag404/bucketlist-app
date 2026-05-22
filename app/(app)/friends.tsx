import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import { useStore } from '../../src/store'
import { supabase } from '../../src/lib/supabase'
import { sticker, BUCKET_COLORS } from '../../src/design/sticker'
import { FriendProfile } from '../../src/types/database'

const AV_COLORS = [
  { bg: '#7DDCFF', text: '#0C0C0C' },
  { bg: '#C7F356', text: '#0C0C0C' },
  { bg: '#FF7AB6', text: '#0C0C0C' },
  { bg: '#FFD43B', text: '#0C0C0C' },
  { bg: '#5C7BFF', text: '#fff' },
  { bg: '#FF6B5A', text: '#fff' },
]

const SHADOW = 3

function Avatar({ name, colorIdx, size = 44 }: { name: string; colorIdx: number; size?: number }) {
  const ac = AV_COLORS[colorIdx % AV_COLORS.length]
  return (
    <View style={[
      avatarStyles.dot,
      { backgroundColor: ac.bg, width: size, height: size, borderRadius: size / 2 },
    ]}>
      <Text style={[avatarStyles.initials, { color: ac.text, fontSize: size * 0.33 }]}>
        {name?.slice(0, 2).toUpperCase() ?? '??'}
      </Text>
    </View>
  )
}

const avatarStyles = StyleSheet.create({
  dot: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: sticker.ink },
  initials: { fontWeight: '700', letterSpacing: -0.3 },
})

function SectionHeading({ label }: { label: string }) {
  return (
    <Text style={styles.sectionLabel}>{label.toUpperCase()}</Text>
  )
}

export default function FriendsScreen() {
  const {
    buckets, profile,
    pendingApprovals, fetchPendingApprovals, approveJoin, declineJoin,
    friends, incomingFriendRequests, outgoingFriendRequests,
    fetchFriends, sendFriendRequest, acceptFriendRequest, declineFriendRequest,
    removeFriend, addFriendToBucket, leaveBucket, removeMember,
    activeBucketId,
  } = useStore()

  useEffect(() => {
    fetchFriends()
    fetchPendingApprovals()
  }, [])

  const [handleInput, setHandleInput] = useState('')
  const [addingFriend, setAddingFriend] = useState(false)
  const [addResult, setAddResult] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  async function submitFriendRequest() {
    if (!handleInput.trim()) return
    setAddingFriend(true)
    setAddResult(null)
    const err = await sendFriendRequest(handleInput)
    if (err) {
      setAddResult({ type: 'err', msg: err })
    } else {
      setAddResult({ type: 'ok', msg: `Request sent! They'll see it when they open the app.` })
      setHandleInput('')
    }
    setAddingFriend(false)
  }

  const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null)
  const [addingToBucket, setAddingToBucket] = useState<string | null>(null)

  async function handleAddToBucket(friend: FriendProfile, bucketId: string) {
    setAddingToBucket(bucketId)
    const err = await addFriendToBucket(friend.id, bucketId)
    setAddingToBucket(null)
    if (err) {
      Alert.alert('Already in bucket', err)
    } else {
      Alert.alert('Added!', `${friend.name.split(' ')[0]} has been added to the bucket.`)
      setExpandedFriendId(null)
    }
  }

  const [showJoin, setShowJoin] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joiningBucket, setJoiningBucket] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [outgoingPending, setOutgoingPending] = useState<any[]>([])

  useEffect(() => { loadOutgoingPending() }, [buckets.length])

  async function loadOutgoingPending() {
    if (!profile) return
    const { data } = await supabase
      .from('bucket_members')
      .select('id, bucket_id, buckets(name, emoji)')
      .eq('user_id', profile.id)
      .eq('status', 'pending')
    setOutgoingPending(data || [])
  }

  async function joinBucket() {
    setJoinError('')
    if (!joinCode.trim()) { setJoinError('Enter an invite code.'); return }
    if (!profile) return
    setJoiningBucket(true)
    try {
      const { data: found } = await supabase
        .from('buckets')
        .select('id, name')
        .eq('invite_code', joinCode.trim().toLowerCase())
        .single()

      if (!found) { setJoinError("That code didn't match any bucket."); setJoiningBucket(false); return }

      const { data: existing } = await supabase
        .from('bucket_members')
        .select('id, status')
        .eq('bucket_id', found.id)
        .eq('user_id', profile.id)
        .single()

      if (existing?.status === 'active') { setJoinError("You're already in that bucket."); setJoiningBucket(false); return }
      if (existing?.status === 'pending') { setJoinError("Request already pending for that bucket."); setJoiningBucket(false); return }

      await supabase.from('bucket_members').insert({ bucket_id: found.id, user_id: profile.id, status: 'pending' })
      setJoinCode(''); setShowJoin(false)
      loadOutgoingPending()
      Alert.alert('Request sent!', `Your request to join "${found.name}" is waiting for the owner's approval.`)
    } catch (e: any) {
      setJoinError(e.message ?? 'Something went wrong')
    }
    setJoiningBucket(false)
  }

  function confirmRemoveFriend(friend: FriendProfile) {
    Alert.alert(
      'Remove friend',
      `Remove ${friend.name} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFriend(friend.friendshipId) },
      ]
    )
  }

  function confirmLeave(bucketId: string, bucketName: string) {
    Alert.alert(
      'Leave bucket',
      `Leave "${bucketName}"? You'll need a new invite code to rejoin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => leaveBucket(bucketId) },
      ]
    )
  }

  function confirmRemoveFromBucket(friendId: string, friendName: string, bucketId: string, bucketName: string) {
    Alert.alert(
      'Remove from bucket',
      `Remove ${friendName} from "${bucketName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeMember(friendId, bucketId) },
      ]
    )
  }

  function bucketsToAddFriend(friendId: string) {
    return buckets.filter(b => {
      const members = (b as any).members || []
      return !members.some((m: any) => m.user_id === friendId && m.status === 'active')
    })
  }

  function sharedBuckets(friendId: string) {
    return buckets.filter(b => {
      const members = (b as any).members || []
      return members.some((m: any) => m.user_id === friendId && m.status === 'active')
    })
  }

  const [suggestions, setSuggestions] = useState<any[]>([])
  useEffect(() => {
    async function loadSuggestions() {
      if (!profile || buckets.length === 0) return
      const bucketIds = buckets.map(b => b.id)
      const friendIds = new Set(friends.map(f => f.id))
      const { data } = await supabase
        .from('bucket_members')
        .select('user_id, profiles(*)')
        .in('bucket_id', bucketIds)
        .eq('status', 'active')
        .neq('user_id', profile.id)
      if (!data) return
      const seen = new Set<string>()
      const suggested = data
        .filter((m: any) => {
          if (seen.has(m.user_id) || friendIds.has(m.user_id)) return false
          seen.add(m.user_id)
          return true
        })
        .map((m: any) => m.profiles)
        .filter(Boolean)
      setSuggestions(suggested)
    }
    loadSuggestions()
  }, [profile?.id, friends.length, buckets.length])

  const activeBucket = buckets.find(b => b.id === activeBucketId)
  const leavableBuckets = buckets.filter(b => b.created_by !== profile?.id)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headlineRow}>
            <Text style={styles.headlineMain}>FRIEND</Text>
            <View style={styles.headlineHighlight}>
              <Text style={styles.headlineHighlightText}>S</Text>
            </View>
          </View>
          <Text style={styles.headlineSub}>PEOPLE YOU SHARE ADVENTURES WITH</Text>
        </View>

        {/* Incoming friend requests */}
        {incomingFriendRequests.length > 0 && (
          <View style={styles.section}>
            <SectionHeading label={`Friend requests (${incomingFriendRequests.length})`} />
            {incomingFriendRequests.map((req: any) => {
              const p = req.profile
              if (!p) return null
              return (
                <View key={req.id} style={styles.requestCardWrap}>
                  <View style={styles.requestCardShadow} pointerEvents="none" />
                  <View style={[styles.requestCard, { backgroundColor: sticker.cyan }]}>
                    <Avatar name={p.name} colorIdx={p.avatar_color ?? 0} size={40} />
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestName}>{p.name}</Text>
                      <Text style={styles.requestHandle}>@{p.handle}</Text>
                    </View>
                    <View style={styles.requestBtns}>
                      <View style={styles.acceptWrap}>
                        <View style={styles.acceptShadow} pointerEvents="none" />
                        <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptFriendRequest(req.id)}>
                          <Text style={styles.acceptBtnText}>✓ YES</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={styles.declineBtn} onPress={() => declineFriendRequest(req.id)}>
                        <Text style={styles.declineBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Incoming bucket join requests */}
        {pendingApprovals.length > 0 && (
          <View style={styles.section}>
            <SectionHeading label={`Bucket join requests (${pendingApprovals.length})`} />
            {pendingApprovals.map((req: any) => {
              const p = req.profiles
              const b = req.buckets
              if (!p) return null
              return (
                <View key={req.id} style={styles.requestCardWrap}>
                  <View style={styles.requestCardShadow} pointerEvents="none" />
                  <View style={[styles.requestCard, { backgroundColor: sticker.yellow }]}>
                    <Avatar name={p.name} colorIdx={p.avatar_color ?? 0} size={40} />
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestName}>{p.name}</Text>
                      <Text style={styles.requestHandle}>
                        wants to join <Text style={styles.bucketNameText}>{b?.emoji} {b?.name}</Text>
                      </Text>
                    </View>
                    <View style={styles.requestBtns}>
                      <View style={styles.acceptWrap}>
                        <View style={styles.acceptShadow} pointerEvents="none" />
                        <TouchableOpacity style={styles.acceptBtn} onPress={() => approveJoin(req.id, req.bucket_id, req.user_id)}>
                          <Text style={styles.acceptBtnText}>✓</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={styles.declineBtn} onPress={() => declineJoin(req.id)}>
                        <Text style={styles.declineBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Add a friend */}
        <View style={styles.section}>
          <SectionHeading label="Add a friend" />
          <Text style={styles.sectionHint}>
            Search by @handle — they'll get a friend request.
          </Text>
          <View style={styles.addRow}>
            <View style={styles.inputWrap}>
              <View style={styles.inputShadow} pointerEvents="none" />
              <TextInput
                style={styles.handleInput}
                placeholder="@HANDLE"
                placeholderTextColor={sticker.inkMuted}
                value={handleInput}
                onChangeText={t => { setHandleInput(t); setAddResult(null) }}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={submitFriendRequest}
                returnKeyType="send"
              />
            </View>
            <View style={styles.sendBtnWrap}>
              <View style={styles.sendBtnShadow} pointerEvents="none" />
              <TouchableOpacity
                style={[styles.sendBtn, addingFriend && { opacity: 0.6 }]}
                onPress={submitFriendRequest}
                disabled={addingFriend}
              >
                {addingFriend
                  ? <ActivityIndicator color={sticker.bg} size="small" />
                  : <Text style={styles.sendBtnText}>SEND</Text>
                }
              </TouchableOpacity>
            </View>
          </View>

          {addResult && (
            <View style={[styles.resultChip, { backgroundColor: addResult.type === 'ok' ? sticker.lime : sticker.red }]}>
              <Text style={styles.resultChipText}>{addResult.msg}</Text>
            </View>
          )}

          {outgoingFriendRequests.length > 0 && (
            <View style={styles.outgoingList}>
              <Text style={styles.outgoingLabel}>SENT REQUESTS</Text>
              {outgoingFriendRequests.map((req: any) => (
                <View key={req.id} style={styles.outgoingRow}>
                  <Text style={styles.outgoingHandle}>@{req.profile?.handle}</Text>
                  <View style={styles.pendingChip}>
                    <Text style={styles.pendingChipText}>PENDING</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <SectionHeading label="People you may know" />
            <Text style={styles.sectionHint}>Already in a bucket with you!</Text>
            {suggestions.map((p: any) => (
              <View key={p.id} style={styles.requestCardWrap}>
                <View style={styles.requestCardShadow} pointerEvents="none" />
                <View style={[styles.requestCard, { backgroundColor: sticker.surface }]}>
                  <Avatar name={p.name} colorIdx={p.avatar_color ?? 0} size={40} />
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{p.name}</Text>
                    <Text style={styles.requestHandle}>@{p.handle}</Text>
                  </View>
                  <View style={styles.acceptWrap}>
                    <View style={styles.acceptShadow} pointerEvents="none" />
                    <TouchableOpacity
                      style={[styles.acceptBtn, { backgroundColor: sticker.lime }]}
                      onPress={async () => {
                        const err = await sendFriendRequest(p.handle)
                        if (err) Alert.alert('Error', err)
                        else Alert.alert('Request sent!', `Friend request sent to ${p.name}.`)
                      }}
                    >
                      <Text style={styles.acceptBtnText}>+ ADD</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Friends list */}
        <View style={styles.section}>
          <SectionHeading label={friends.length > 0 ? `Your friends (${friends.length})` : 'Your friends'} />

          {friends.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyCardShadow} pointerEvents="none" />
              <View style={styles.emptyCardInner}>
                <Text style={styles.emptyEmoji}>👥</Text>
                <Text style={styles.emptyTitle}>NO FRIENDS YET</Text>
                <Text style={styles.emptySubtitle}>
                  Add someone by their @handle above.
                </Text>
              </View>
            </View>
          ) : (
            friends.map((friend, fi) => {
              const shared = sharedBuckets(friend.id)
              const canAdd = bucketsToAddFriend(friend.id)
              const isExpanded = expandedFriendId === friend.id
              const cardColor = BUCKET_COLORS[fi % BUCKET_COLORS.length]

              return (
                <View key={friend.id} style={styles.friendCardWrap}>
                  <View style={styles.friendCardShadow} pointerEvents="none" />
                  <View style={[styles.friendCard, { borderLeftColor: cardColor, borderLeftWidth: 6 }]}>
                    <View style={styles.friendRow}>
                      <Avatar name={friend.name} colorIdx={friend.avatar_color ?? 0} size={44} />
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendHandle}>@{friend.handle}</Text>
                        {shared.length > 0 && (
                          <View style={styles.bucketTags}>
                            {shared.map(b => (
                              <View key={b.id} style={[styles.bucketTag, { backgroundColor: cardColor }]}>
                                <Text style={styles.bucketTagText}>{b.emoji} {b.name.toUpperCase()}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                      <View style={styles.addBucketWrap}>
                        <View style={styles.addBucketShadow} pointerEvents="none" />
                        <TouchableOpacity
                          style={[styles.addBucketBtn, canAdd.length === 0 && styles.addBucketBtnDisabled]}
                          onPress={() => setExpandedFriendId(isExpanded ? null : friend.id)}
                          disabled={canAdd.length === 0}
                        >
                          <Text style={[styles.addBucketBtnText, canAdd.length === 0 && { color: sticker.inkMuted }]}>
                            {canAdd.length === 0 ? 'ALL IN' : '+ BUCKET'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isExpanded && canAdd.length > 0 && (
                      <View style={styles.bucketPicker}>
                        <Text style={styles.bucketPickerLabel}>ADD TO WHICH BUCKET?</Text>
                        {canAdd.map(b => (
                          <TouchableOpacity
                            key={b.id}
                            style={styles.bucketPickerRow}
                            onPress={() => handleAddToBucket(friend, b.id)}
                            disabled={addingToBucket === b.id}
                          >
                            <Text style={styles.bucketPickerEmoji}>{b.emoji}</Text>
                            <Text style={styles.bucketPickerName}>{b.name}</Text>
                            {addingToBucket === b.id
                              ? <ActivityIndicator size="small" color={sticker.ink} />
                              : <Text style={styles.bucketPickerArrow}>+</Text>
                            }
                          </TouchableOpacity>
                        ))}
                        {shared.filter(b => b.created_by === profile?.id).length > 0 && (
                          <>
                            <Text style={[styles.bucketPickerLabel, { marginTop: 12, color: sticker.red }]}>
                              REMOVE FROM BUCKET
                            </Text>
                            {shared.filter(b => b.created_by === profile?.id).map(b => (
                              <TouchableOpacity
                                key={b.id}
                                style={styles.bucketPickerRow}
                                onPress={() => {
                                  setExpandedFriendId(null)
                                  confirmRemoveFromBucket(friend.id, friend.name, b.id, b.name)
                                }}
                              >
                                <Text style={styles.bucketPickerEmoji}>{b.emoji}</Text>
                                <Text style={[styles.bucketPickerName, { color: sticker.red }]}>{b.name}</Text>
                                <Text style={{ color: sticker.red, fontWeight: '700', fontSize: 12 }}>REMOVE</Text>
                              </TouchableOpacity>
                            ))}
                          </>
                        )}
                      </View>
                    )}

                    <TouchableOpacity style={styles.removeFriendBtn} onPress={() => confirmRemoveFriend(friend)}>
                      <Text style={styles.removeFriendText}>REMOVE FRIEND</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          )}
        </View>

        {/* Invite code for active bucket */}
        {activeBucket?.invite_code && (
          <View style={styles.section}>
            <SectionHeading label="Share bucket invite" />
            <Text style={styles.sectionHint}>Share this code — anyone can request to join.</Text>
            <InviteCodeBox code={activeBucket.invite_code} bucketName={`${activeBucket.emoji} ${activeBucket.name}`} />
          </View>
        )}

        {/* Outgoing bucket pending */}
        {outgoingPending.length > 0 && (
          <View style={styles.section}>
            <SectionHeading label="Waiting for bucket approval" />
            {outgoingPending.map((req: any) => (
              <View key={req.id} style={styles.pendingRow}>
                <Text style={{ fontSize: 26 }}>{req.buckets?.emoji || '🪣'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.requestName}>{req.buckets?.name}</Text>
                  <Text style={styles.requestHandle}>Awaiting owner approval</Text>
                </View>
                <View style={styles.pendingChip}>
                  <Text style={styles.pendingChipText}>PENDING</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Join a bucket by code */}
        <View style={styles.section}>
          {showJoin ? (
            <View style={styles.joinCardWrap}>
              <View style={styles.joinCardShadow} pointerEvents="none" />
              <View style={styles.joinCard}>
                <Text style={styles.joinTitle}>JOIN A BUCKET</Text>
                <Text style={styles.sectionHint}>Enter the invite code shared with you.</Text>
                {joinError ? (
                  <View style={[styles.resultChip, { backgroundColor: sticker.red, marginBottom: 10 }]}>
                    <Text style={styles.resultChipText}>{joinError}</Text>
                  </View>
                ) : null}
                <View style={styles.inputWrap}>
                  <View style={styles.inputShadow} pointerEvents="none" />
                  <TextInput
                    style={styles.handleInput}
                    placeholder="INVITE CODE"
                    placeholderTextColor={sticker.inkMuted}
                    value={joinCode}
                    onChangeText={t => { setJoinCode(t); setJoinError('') }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.joinBtns}>
                  <View style={styles.sendBtnWrap}>
                    <View style={styles.sendBtnShadow} pointerEvents="none" />
                    <TouchableOpacity
                      style={[styles.sendBtn, joiningBucket && { opacity: 0.6 }]}
                      onPress={joinBucket}
                      disabled={joiningBucket}
                    >
                      {joiningBucket
                        ? <ActivityIndicator color={sticker.bg} size="small" />
                        : <Text style={styles.sendBtnText}>SEND REQUEST</Text>
                      }
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => { setShowJoin(false); setJoinCode(''); setJoinError('') }}
                  >
                    <Text style={styles.cancelBtnText}>CANCEL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.actionBtnWrap}>
              <View style={styles.actionBtnShadow} pointerEvents="none" />
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowJoin(true)}>
                <Text style={styles.actionBtnEmoji}>🔗</Text>
                <Text style={styles.actionBtnText}>JOIN BUCKET WITH INVITE CODE</Text>
                <Text style={styles.actionBtnArrow}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Leave a bucket */}
        {leavableBuckets.length > 0 && (
          <View style={styles.section}>
            <SectionHeading label="Leave a bucket" />
            {leavableBuckets.map(b => (
              <View key={b.id} style={styles.actionBtnWrap}>
                <View style={styles.actionBtnShadow} pointerEvents="none" />
                <TouchableOpacity style={styles.actionBtn} onPress={() => confirmLeave(b.id, b.name)}>
                  <Text style={styles.actionBtnEmoji}>{b.emoji || '🪣'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actionBtnText}>{b.name.toUpperCase()}</Text>
                    <Text style={styles.leaveSub}>YOU ARE A MEMBER</Text>
                  </View>
                  <Text style={[styles.actionBtnArrow, { color: sticker.red }]}>LEAVE</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function InviteCodeBox({ code, bucketName }: { code: string; bucketName: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      }
    } catch { }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <View style={styles.codeBoxWrap}>
      <View style={styles.codeBoxShadow} pointerEvents="none" />
      <TouchableOpacity style={styles.codeBox} onPress={copy} activeOpacity={0.85}>
        <View style={styles.codeBoxTop}>
          <Text style={styles.codeBoxBucket}>{bucketName.toUpperCase()}</Text>
          <View style={[styles.copiedChip, { backgroundColor: copied ? sticker.lime : sticker.surface }]}>
            <Text style={styles.copiedChipText}>{copied ? '✓ COPIED!' : 'TAP TO COPY'}</Text>
          </View>
        </View>
        <Text style={styles.codeBoxCode}>{code.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: sticker.bg },
  scroll: { paddingBottom: 48 },

  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: sticker.ink,
  },
  headlineRow: { flexDirection: 'row', alignItems: 'flex-end' },
  headlineMain: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2.2,
    lineHeight: 56,
    color: sticker.ink,
    textTransform: 'uppercase',
  },
  headlineHighlight: {
    backgroundColor: sticker.lime,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: sticker.ink,
    borderRadius: 4,
    transform: [{ rotate: '-2deg' }],
    marginLeft: 4,
    marginBottom: 6,
  },
  headlineHighlightText: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2.2,
    lineHeight: 60,
    color: sticker.ink,
  },
  headlineSub: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: sticker.inkMuted,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: sticker.ink,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: sticker.ink,
    marginBottom: 10,
  },
  sectionHint: {
    fontSize: 12,
    fontWeight: '500',
    color: sticker.inkMuted,
    lineHeight: 17,
    marginBottom: 12,
  },

  // Request cards
  requestCardWrap: { marginBottom: 10, marginRight: SHADOW },
  requestCardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 14,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: sticker.ink,
    padding: 12,
  },
  requestInfo: { flex: 1 },
  requestName: { fontSize: 14, fontWeight: '700', color: sticker.ink, marginBottom: 2 },
  requestHandle: { fontSize: 11, fontWeight: '500', color: sticker.inkMuted },
  bucketNameText: { fontWeight: '700', color: sticker.ink },
  requestBtns: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  acceptWrap: { marginBottom: 2, marginRight: 2 },
  acceptShadow: {
    position: 'absolute',
    top: 2, left: 2, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 10,
  },
  acceptBtn: {
    backgroundColor: sticker.ink,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: sticker.ink,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  acceptBtnText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: sticker.bg },
  declineBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: sticker.surface,
    borderWidth: 2,
    borderColor: sticker.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: { fontSize: 13, color: sticker.ink, fontWeight: '700' },

  // Add friend
  addRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  inputWrap: { flex: 1, marginBottom: SHADOW, marginRight: SHADOW },
  inputShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 12,
    zIndex: -1,
  },
  handleInput: {
    backgroundColor: sticker.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: sticker.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.ink,
  },
  sendBtnWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  sendBtnShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 12,
  },
  sendBtn: {
    backgroundColor: sticker.ink,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: sticker.ink,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  sendBtnText: { color: sticker.bg, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  resultChip: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: sticker.ink,
    padding: 10,
    marginBottom: 10,
  },
  resultChipText: { fontSize: 12, fontWeight: '600', color: sticker.ink },

  outgoingList: { marginTop: 8, gap: 6 },
  outgoingLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: sticker.inkMuted,
    marginBottom: 4,
  },
  outgoingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  outgoingHandle: { fontSize: 13, fontWeight: '600', color: sticker.ink, flex: 1 },
  pendingChip: {
    backgroundColor: sticker.surface,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: sticker.ink,
  },
  pendingChipText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: sticker.inkMuted },

  // Empty state
  emptyCard: { marginBottom: SHADOW, marginRight: SHADOW },
  emptyCardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 16,
  },
  emptyCardInner: {
    backgroundColor: sticker.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: sticker.ink,
    padding: 24,
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: sticker.ink, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, fontWeight: '500', color: sticker.inkMuted, textAlign: 'center', lineHeight: 18 },

  // Friend cards
  friendCardWrap: { marginBottom: 12, marginRight: SHADOW },
  friendCardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 16,
  },
  friendCard: {
    backgroundColor: sticker.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: sticker.ink,
    overflow: 'hidden',
  },
  friendRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  friendInfo: { flex: 1 },
  friendName: { fontSize: 14, fontWeight: '700', color: sticker.ink, marginBottom: 2 },
  friendHandle: { fontSize: 11, fontWeight: '500', color: sticker.inkMuted, marginBottom: 6 },
  bucketTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  bucketTag: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: sticker.ink,
  },
  bucketTagText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, color: sticker.ink },
  addBucketWrap: { marginBottom: 2, marginRight: 2 },
  addBucketShadow: {
    position: 'absolute',
    top: 2, left: 2, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 10,
  },
  addBucketBtn: {
    backgroundColor: sticker.yellow,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: sticker.ink,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  addBucketBtnDisabled: { backgroundColor: sticker.surface },
  addBucketBtnText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, color: sticker.ink },

  bucketPicker: {
    backgroundColor: sticker.bg,
    borderTopWidth: 2,
    borderTopColor: sticker.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bucketPickerLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: sticker.inkMuted,
    marginBottom: 8,
  },
  bucketPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: sticker.ink + '30',
  },
  bucketPickerEmoji: { fontSize: 20 },
  bucketPickerName: { flex: 1, fontSize: 13, fontWeight: '600', color: sticker.ink },
  bucketPickerArrow: { fontSize: 18, color: sticker.ink, fontWeight: '700' },

  removeFriendBtn: {
    borderTopWidth: 1.5,
    borderTopColor: sticker.ink + '40',
    padding: 10,
    alignItems: 'center',
  },
  removeFriendText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: sticker.inkMuted },

  // Invite code
  codeBoxWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  codeBoxShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 16,
  },
  codeBox: {
    backgroundColor: sticker.cyan,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    padding: 18,
  },
  codeBoxTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeBoxBucket: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: sticker.ink },
  copiedChip: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: sticker.ink,
  },
  copiedChipText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: sticker.ink },
  codeBoxCode: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 6,
    color: sticker.ink,
    textAlign: 'center',
  },

  // Join card
  joinCardWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  joinCardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 16,
  },
  joinCard: {
    backgroundColor: sticker.yellow,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: sticker.ink,
    padding: 16,
  },
  joinTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3, color: sticker.ink, marginBottom: 4 },
  joinBtns: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cancelBtn: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: sticker.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: sticker.surface,
  },
  cancelBtnText: { fontSize: 11, fontWeight: '700', color: sticker.ink },

  // Action rows
  actionBtnWrap: { marginBottom: 10, marginRight: SHADOW },
  actionBtnShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: sticker.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: sticker.ink,
  },
  actionBtnEmoji: { fontSize: 22 },
  actionBtnText: { flex: 1, fontSize: 12, fontWeight: '700', letterSpacing: 0.3, color: sticker.ink },
  actionBtnArrow: { fontSize: 18, color: sticker.inkMuted, fontWeight: '700' },
  leaveSub: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: sticker.inkMuted, marginTop: 2 },

  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
})
