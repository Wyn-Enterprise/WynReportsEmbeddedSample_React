export const createSignInForm = (portalUrl, username, password) => {
    document.getElementById('sign-in-portal-url').value = portalUrl || '';
    document.getElementById('sign-in-username').value = username || '';
    document.getElementById('sign-in-password').value = password || '';
    const signInForm = {
        open: () => {
            document.getElementById('sign-in-root').style.display = '';
            document.getElementById("sign-in-username").focus();
        },
        close: () => { document.getElementById('sign-in-root').style.display = 'none' },
        onSignIn: null
    }
    const signInButton = document.getElementById('sign-in-button');
    const onSignIn = async () => {
        signInButton.disabled = true;
        let portalUrl = document.getElementById('sign-in-portal-url').value
        let username = document.getElementById('sign-in-username').value
        let password = document.getElementById('sign-in-password').value
        try {
            await signInForm.onSignIn(portalUrl, username, password);
            document.getElementById('sign-in-error').innerHTML = null
        }
        catch (err) {
            document.getElementById('sign-in-error').innerHTML = err.message
        }
        finally {
            signInButton.disabled = false;
        }
    };
    signInButton.onclick = onSignIn
    document.getElementById('sign-in-root').addEventListener("keyup", (event) => {
        if (event.keyCode === 13) onSignIn()
    });
    return signInForm
}