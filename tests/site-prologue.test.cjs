const { test } = require('node:test');
const assert = require('node:assert/strict');
const opening = require('../src/site-prologue-data.js');
const physics = require('../src/physics-level-data.js');
const math = require('../src/math-level-data.js');
const chemistry = require('../src/chemistry-data.js');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

test('the opening is a 96-second nine-act film using existing game companions', () => {
  assert.equal(opening.totalDuration, 96000);
  assert.equal(opening.scenes.length, 9);
  const ids = new Set([...physics.levels, ...math.levels, ...chemistry.levels].map(level => level.id));
  const subjects = new Set();
  for (const scene of opening.scenes) {
    for (const id of scene.cast) {
      assert.ok(ids.has(id), 'opening invents a companion: ' + id);
      subjects.add(id[0]);
    }
    assert.equal(scene.lines.length, 2);
  }
  assert.deepEqual([...subjects].sort(), ['C','M','P']);
  assert.notEqual(opening.sessionKey, 'knowledge-islands-v2');
});

test('chapter boundaries and caption cues use elapsed active playback time', () => {
  for (const [index, scene] of opening.scenes.entries()) {
    assert.equal(opening.frameAt(scene.start).index, index);
    assert.equal(opening.frameAt(scene.start + scene.duration/2 - 1).cue, 0);
    assert.equal(opening.frameAt(scene.start + scene.duration/2).cue, 1);
    const end = opening.frameAt(scene.start + scene.duration - 1);
    assert.equal(end.index, index);
    assert.equal(end.finished, false);
  }
  assert.equal(opening.frameAt(96000).finished, true);
  assert.equal(opening.frameAt(96000).index, 8);
});

test('invalid or out-of-range timeline values cannot produce an invalid scene', () => {
  for (const value of [undefined, NaN, Infinity, -1, -5000]) {
    const frame = opening.frameAt(value);
    assert.equal(frame.index, 0);
    assert.equal(frame.progress, 0);
  }
  assert.equal(opening.frameAt(999999).elapsed, 96000);
});

test('all recorded Chinese narration matches the subtitles and fits its playback slot', () => {
  const audioRoot = path.join(__dirname, '../assets/prologue');
  const manifest = JSON.parse(fs.readFileSync(path.join(audioRoot, 'narration.json'), 'utf8'));
  assert.equal(manifest.clips.length, 18);
  for (const scene of opening.scenes) for (const [cue, text] of scene.lines.entries()) {
    const clip = manifest.clips.find(clip => clip.id === scene.id && clip.cue === cue);
    assert.ok(clip, `missing narration: ${scene.id}-${cue}`);
    assert.equal(clip.text, text, 'recording is stale after a subtitle edit');
    assert.ok(clip.duration > 0 && clip.duration <= scene.duration / 2000, 'recording will be cut off');
    const audio = fs.readFileSync(path.join(audioRoot, clip.file));
    assert.equal(createHash('sha256').update(audio).digest('hex'), clip.sha256, 'manifest does not describe the current MP3');
  }
});
