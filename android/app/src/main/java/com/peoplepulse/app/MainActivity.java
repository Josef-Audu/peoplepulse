package com.peoplepulse.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * PeoplePulse Android entry point: a thin WebView shell around the production
 * web application. All product behaviour (including Supabase Auth with its
 * cookie-based sessions) runs on the site itself; this activity only hosts it.
 *
 * Auth note: Supabase verification links opened from an email app land in the
 * system browser (no app-links/assetlinks change was made to the site), so a
 * user verifies there and then signs in inside this app. Sessions live in the
 * WebView cookie store, exactly like a browser tab.
 */
public class MainActivity extends Activity {

    /** Production site. HTTPS only; never point a production build at localhost. */
    private static final String PRODUCTION_URL = "https://peoplepulse-200.netlify.app/";
    /** Hosts allowed to load inside the WebView. Anything else opens in the browser. */
    private static final String TRUSTED_HOST = "peoplepulse-200.netlify.app";

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        // Supabase SSR sessions are cookie-based: the WebView must accept them.
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                // Keep the trusted production host in-app; hand anything else
                // (verification links from other senders, external docs, …) to
                // the system browser instead of loading untrusted content.
                if (TRUSTED_HOST.equalsIgnoreCase(uri.getHost())) {
                    return false;
                }
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(PRODUCTION_URL);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    /** Back navigates WebView history first; exits only at the first page. */
    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
