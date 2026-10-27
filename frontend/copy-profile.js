const fs = require('fs');
const path = require('path');

const candidates = [
  path.join(__dirname, 'src', 'assets', 'profile.jpg'),
  path.join(__dirname, 'public', 'images', 'profile.jpg'),
  path.join(__dirname, '..', 'backend', 'uploads', 'profile', '1792744084542-729016836.jpg'),
  path.join(__dirname, '..', 'backend', 'uploads', 'profile', '1791741809999-180633976.jpg'),
];

const destPublic = path.join(__dirname, 'public', 'images', 'profile.jpg');
const destPublicRoot = path.join(__dirname, 'public', 'profile.jpg');
const destAssets = path.join(__dirname, 'src', 'assets', 'profile.jpg');
const destBuild = path.join(__dirname, 'build', 'images', 'profile.jpg');
const destBuildRoot = path.join(__dirname, 'build', 'profile.jpg');

for (const candidate of candidates) {
  if (fs.existsSync(candidate)) {
    try {
      [destPublic, destPublicRoot, destAssets, destBuild, destBuildRoot].forEach(dest => {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        if (candidate !== dest) {
          fs.copyFileSync(candidate, dest);
        }
      });
      console.log('✅ Profile image successfully synced across assets, public, and build.');
      break;
    } catch (e) {
      console.error('Error copying profile image:', e);
    }
  }
}
