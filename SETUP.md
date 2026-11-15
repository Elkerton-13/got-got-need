# Got Got Need: setup

> **This copy is already live** at https://elkerton-13.github.io/got-got-need/ (GitHub Pages + Firebase project `got-got-need-d9682`). To update the app, change the files in `docs/` and push to `main`. If you change `firestore.rules`, paste the new version into Firebase console > Firestore Database > Rules and press Publish. The steps below set up a fresh copy on Firebase Hosting instead.

This puts the swap app on a normal web link you can share in WhatsApp. It uses Google Firebase's free plan, so you don't need a payment card. It takes about 15 minutes on a laptop.

You need a Google account, and a laptop with Node.js installed (for the one upload command).

## 1. Create the Firebase project

1. Go to https://console.firebase.google.com and click **Create a project**. Call it something like `got-got-need`. You can switch Google Analytics off. Click **Create**.
2. In the left menu, open **Build → Firestore Database** and click **Create database**.
   - Location: pick one near you, e.g. `europe-west2 (London)`.
   - Choose **Start in production mode** and click **Create**.
3. Open **Build → Authentication**, click **Get started**, then on the **Sign-in method** tab:
   - **Google**: click it, switch **Enable** on, pick your email as the support email, then **Save**.
   - **Anonymous**: click it, switch **Enable** on, then **Save**.
4. Click the gear icon (**Project settings**) and go to **General**. Under **Your apps**, click the web icon **</>**. Give it the nickname `Got Got Need` and click **Register app**. Leave "Firebase Hosting" unticked here.
5. Firebase shows a block of settings called `firebaseConfig`. Keep that page open for the next step.

## 2. Add your settings

Open `docs/config.js` in this folder. Replace each `PASTE_...` value with the matching value from step 1.5, then save the file.

## 3. Upload it

Open a terminal in this folder, then run these one at a time:

```
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy
```

- `firebase use --add` asks which project to use. Pick the one you made, and type `default` when it asks for an alias.
- `firebase deploy` uploads the app and the security rules. At the end it prints your link, for example `https://got-got-need.web.app`.

## 4. Become the admin, then invite people

1. **Open the link yourself first** and tap **Continue with Google**. The first person to sign in with Google becomes the admin. You'll then see **Invite friends** and **Keep a list for someone** on the Friends tab.
2. Copy the link from the Friends tab and send it in your WhatsApp group.

## Good to know

- **Two ways in for friends.** **Continue with Google** means their list follows them to any phone. **Just use this phone** needs no account, but if they clear their browser or change phone the list is lost. They can switch later in **Settings → Keep my list safe with Google**.
- **If Google sign-in won't open from inside WhatsApp**, tap the ⋯ menu and choose **Open in browser** (Chrome or Safari).
- **Who can see what.** Anyone who joins through the link can see everyone's names and card lists. Use first names only. Each person can only change their own list. The admin can also edit or remove lists.
- **Photos.** On the Photo tab, people copy a set of instructions into ChatGPT or Claude with a photo of their cards. Then they paste the reply back into the app. Free accounts work. **Add to my cards** sorts them: a card they haven't got goes in their collection, and copies they already have (or cards from sets they don't collect) become swaps.
- **Parallels.** Shiny, coloured or numbered versions of a card are kept apart from the normal ones, so a parallel never counts as a swap. Add them with **✦ It's a parallel** on the number pad, by typing `32p`, or by holding a card and choosing **One of these is a parallel**. The AI photo step marks them with `p` too.
- **Swap requests.** Tap a card in a friend's list to ask for it (or one of their needs to offer your spare). They can **Accept**, **Change it** (swap cards in or out and send it back) or **Decline**. Demo friends are only on your own phone, so they can't get requests.
- **Swap settings** (Settings, per person): **Teams I'm looking for** puts those clubs first; **Like-for-like swaps** counts points (base 1, inserts 2, harder inserts 3, case hits and short prints 5) and warns before an uneven swap; **Happy to gift my spares** lets friends ask for spares with nothing in return. These are saved inside the existing `scope` list, so the Firestore rules don't change.
- **Kick-off screen.** Opening the app shows a stadium where you flick a ball into the net to go in. It shows once per visit, has a **Skip** button, and can be switched off in **Settings → Kick-off screen**. Add `?kick` to the link to see it again.
- **Resetting the admin.** In the Firebase console, open **Firestore Database**, then `config`, then `admin`, and delete that document. The next person to sign in with Google becomes the admin.
- **Updating the app later.** Replace `docs/index.html` and run `firebase deploy` again.
- **Cost.** The free plan includes 50,000 reads and 20,000 writes a day, which is far more than a group of friends uses.
