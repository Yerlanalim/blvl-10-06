react-dom-client.development.js:24651 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
react-dom-client.development.js:4129 Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <ErrorBoundary errorComponent={function GlobalError} errorStyles={[...]} errorScripts={[...]}>
      <ErrorBoundaryHandler pathname="/" errorComponent={function GlobalError} errorStyles={[...]} errorScripts={[...]}>
        <LoadingBoundary loading={null}>
          <HTTPAccessFallbackBoundary notFound={[...]} forbidden={undefined} unauthorized={undefined}>
            <HTTPAccessFallbackErrorBoundary pathname="/" notFound={[...]} forbidden={undefined} unauthorized={undefined} ...>
              <RedirectBoundary>
                <RedirectErrorBoundary router={{...}}>
                  <InnerLayoutRouter parallelRouterKey="children" url="/" tree={[...]} childNodes={Map} ...>
                    <Home>
                      <div className="min-h-screen">
                        <nav>
                        <section>
                        <section>
                        <section>
                        <HomePricing>
                          <section id="pricing" className="py-24 bg-g...">
                            <div className="max-w-7xl ...">
                              <div className="text-cente...">
                                <h2>
                                <p className="text-gray-600 text-lg">
+                                 {"Choose the plan that's right for your business (IT'S PLACEHOLDER NO PRICING FOR ..."}
-                                 Choose the plan that fits your learning journey
                              ...
                        ...
                    ...

    at throwOnHydrationMismatch (react-dom-client.development.js:4129:11)
    at prepareToHydrateHostInstance (react-dom-client.development.js:4225:21)
    at completeWork (react-dom-client.development.js:13696:15)
    at runWithFiberInDEV (react-dom-client.development.js:544:16)
    at completeUnitOfWork (react-dom-client.development.js:15200:19)
    at performUnitOfWork (react-dom-client.development.js:15081:11)
    at workLoopConcurrent (react-dom-client.development.js:15058:9)
    at renderRootConcurrent (react-dom-client.development.js:15033:15)
    at performWorkOnRoot (react-dom-client.development.js:14350:13)
    at performWorkOnRootViaSchedulerTask (react-dom-client.development.js:15955:7)
    at MessagePort.performWorkUntilDeadline (scheduler.development.js:44:48)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=throwOnHydrationMismatch&arguments=&lineNumber=4129&column=11:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=prepareToHydrateHostInstance&arguments=&lineNumber=4225&column=21:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=completeWork&arguments=&lineNumber=13696&column=15:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=runWithFiberInDEV&arguments=&lineNumber=544&column=16:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=completeUnitOfWork&arguments=&lineNumber=15200&column=19:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
script.debug.js:1 [Vercel Web Analytics] Debug mode is enabled by default in development. No requests will be sent to the server.
script.debug.js:1 [Vercel Web Analytics] Running queued event pageview Object
script.debug.js:1 [Vercel Web Analytics] [pageview] http://localhost:3000/ Object
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=performUnitOfWork&arguments=&lineNumber=15081&column=11:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=workLoopConcurrent&arguments=&lineNumber=15058&column=9:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=renderRootConcurrent&arguments=&lineNumber=15033&column=15:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=performWorkOnRoot&arguments=&lineNumber=14350&column=13:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=performWorkOnRootViaSchedulerTask&arguments=&lineNumber=15955&column=7:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Fscheduler%2Fcjs%2Fscheduler.development.js&methodName=MessagePort.performWorkUntilDeadline&arguments=&lineNumber=44&column=48:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=throwOnHydrationMismatch&arguments=&lineNumber=4129&column=11:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=prepareToHydrateHostInstance&arguments=&lineNumber=4225&column=21:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=completeWork&arguments=&lineNumber=13696&column=15:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=runWithFiberInDEV&arguments=&lineNumber=544&column=16:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=completeUnitOfWork&arguments=&lineNumber=15200&column=19:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=performUnitOfWork&arguments=&lineNumber=15081&column=11:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=workLoopConcurrent&arguments=&lineNumber=15058&column=9:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=renderRootConcurrent&arguments=&lineNumber=15033&column=15:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=performWorkOnRoot&arguments=&lineNumber=14350&column=13:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Freact-dom%2Fcjs%2Freact-dom-client.development.js&methodName=performWorkOnRootViaSchedulerTask&arguments=&lineNumber=15955&column=7:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
__nextjs_original-stack-frame?isServer=false&isEdgeServer=false&isAppDirectory=true&errorMessage=Error%3A+Hydration+failed+because+the+server+rendered+HTML+didn%27t+match+the+client.+As+a+result+this+tree+will+be+regenerated+on+the+client.+This+can+happen+if+a+SSR-ed+Client+Component+used%3A%0A%0A-+A+server%2Fclient+branch+%60if+%28typeof+window+%21%3D%3D+%27undefined%27%29%60.%0A-+Variable+input+such+as+%60Date.now%28%29%60+or+%60Math.random%28%29%60+which+changes+each+time+it%27s+called.%0A-+Date+formatting+in+a+user%27s+locale+which+doesn%27t+match+the+server.%0A-+External+changing+data+without+sending+a+snapshot+of+it+along+with+the+HTML.%0A-+Invalid+HTML+tag+nesting.%0A%0AIt+can+also+happen+if+the+client+has+a+browser+extension+installed+which+messes+with+the+HTML+before+React+loaded.%0A%0Ahttps%3A%2F%2Freact.dev%2Flink%2Fhydration-mismatch%0A%0A++...%0A++++%3CErrorBoundary+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++%3CErrorBoundaryHandler+pathname%3D%22%2F%22+errorComponent%3D%7Bfunction+GlobalError%7D+errorStyles%3D%7B%5B...%5D%7D+errorScripts%3D%7B%5B...%5D%7D%3E%0A++++++++%3CLoadingBoundary+loading%3D%7Bnull%7D%3E%0A++++++++++%3CHTTPAccessFallbackBoundary+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D%3E%0A++++++++++++%3CHTTPAccessFallbackErrorBoundary+pathname%3D%22%2F%22+notFound%3D%7B%5B...%5D%7D+forbidden%3D%7Bundefined%7D+unauthorized%3D%7Bundefined%7D+...%3E%0A++++++++++++++%3CRedirectBoundary%3E%0A++++++++++++++++%3CRedirectErrorBoundary+router%3D%7B%7B...%7D%7D%3E%0A++++++++++++++++++%3CInnerLayoutRouter+parallelRouterKey%3D%22children%22+url%3D%22%2F%22+tree%3D%7B%5B...%5D%7D+childNodes%3D%7BMap%7D+...%3E%0A++++++++++++++++++++%3CHome%3E%0A++++++++++++++++++++++%3Cdiv+className%3D%22min-h-screen%22%3E%0A++++++++++++++++++++++++%3Cnav%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3Csection%3E%0A++++++++++++++++++++++++%3CHomePricing%3E%0A++++++++++++++++++++++++++%3Csection+id%3D%22pricing%22+className%3D%22py-24+bg-g...%22%3E%0A++++++++++++++++++++++++++++%3Cdiv+className%3D%22max-w-7xl+...%22%3E%0A++++++++++++++++++++++++++++++%3Cdiv+className%3D%22text-cente...%22%3E%0A++++++++++++++++++++++++++++++++%3Ch2%3E%0A++++++++++++++++++++++++++++++++%3Cp+className%3D%22text-gray-600+text-lg%22%3E%0A%2B+++++++++++++++++++++++++++++++++%7B%22Choose+the+plan+that%27s+right+for+your+business+%28IT%27S+PLACEHOLDER+NO+PRICING+FOR+...%22%7D%0A-+++++++++++++++++++++++++++++++++Choose+the+plan+that+fits+your+learning+journey%0A++++++++++++++++++++++++++++++...%0A++++++++++++++++++++++++...%0A++++++++++++++++++++...%0A&file=webpack-internal%3A%2F%2F%2F%28app-pages-browser%29%2F.%2Fnode_modules%2Fnext%2Fdist%2Fcompiled%2Fscheduler%2Fcjs%2Fscheduler.development.js&methodName=MessagePort.performWorkUntilDeadline&arguments=&lineNumber=44&column=48:1 
            
            
           Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
hot-reloader-client.js:241 [Fast Refresh] rebuilding
hot-reloader-client.js:68 [Fast Refresh] done in 200ms
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
hot-reloader-client.js:241 [Fast Refresh] rebuilding
hot-reloader-client.js:68 [Fast Refresh] done in 286ms
error-prevention.ts:22  Server  🛡️ Error Prevention System started
script.debug.js:1 [Vercel Web Analytics] [pageview] http://localhost:3000/app Object
hot-reloader-client.js:241 [Fast Refresh] rebuilding
hot-reloader-client.js:68 [Fast Refresh] done in 168ms
error-prevention.ts:22  Server  🛡️ Error Prevention System started
script.debug.js:1 [Vercel Web Analytics] [pageview] http://localhost:3000/app/levels {o: 'http://localhost:3000/app/levels', sv: '0.1.3', sdkn: '@vercel/analytics/next', sdkv: '1.5.0', ts: 1749723795290, …}
useTierAccess.ts:195 Failed to setup realtime subscription: tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance
useTierAccess.useEffect.setupRealtimeSubscription @ useTierAccess.ts:195
await in useTierAccess.useEffect.setupRealtimeSubscription
useTierAccess.useEffect @ useTierAccess.ts:199
react-stack-bottom-frame @ react-dom-client.development.js:23696
runWithFiberInDEV @ react-dom-client.development.js:544
commitHookEffectListMount @ react-dom-client.development.js:10764
commitHookPassiveMountEffects @ react-dom-client.development.js:10884
reconnectPassiveEffects @ react-dom-client.development.js:12818
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
doubleInvokeEffectsOnFiber @ react-dom-client.development.js:15719
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15679
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15700
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15700
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
commitDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15728
flushPassiveEffects @ react-dom-client.development.js:15493
eval @ react-dom-client.development.js:15347
performWorkUntilDeadline @ scheduler.development.js:44
useTierAccess.ts:191 Tier access realtime subscription error
useTierAccess.useEffect.setupRealtimeSubscription @ useTierAccess.ts:191
eval @ RealtimeChannel.js:155
eval @ push.js:100
_matchReceive @ push.js:100
callback @ push.js:72
eval @ RealtimeChannel.js:404
_trigger @ RealtimeChannel.js:389
eval @ RealtimeChannel.js:96
eval @ RealtimeChannel.js:404
_trigger @ RealtimeChannel.js:389
eval @ RealtimeClient.js:420
eval @ RealtimeClient.js:420
decode @ serializer.js:16
_onConnMessage @ RealtimeClient.js:409
conn.onmessage @ RealtimeClient.js:403
hot-reloader-client.js:241 [Fast Refresh] rebuilding
hot-reloader-client.js:68 [Fast Refresh] done in 385ms
error-prevention.ts:22  Server  🛡️ Error Prevention System started
script.debug.js:1 [Vercel Web Analytics] [pageview] http://localhost:3000/app/chat {o: 'http://localhost:3000/app/chat', sv: '0.1.3', sdkn: '@vercel/analytics/next', sdkv: '1.5.0', ts: 1749723822634, …}
useAIQuota.ts:148 Failed to setup realtime subscription for AI quota: tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance
useAIQuota.useEffect.setupRealtimeSubscription @ useAIQuota.ts:148
await in useAIQuota.useEffect.setupRealtimeSubscription
useAIQuota.useEffect @ useAIQuota.ts:152
react-stack-bottom-frame @ react-dom-client.development.js:23696
runWithFiberInDEV @ react-dom-client.development.js:544
commitHookEffectListMount @ react-dom-client.development.js:10764
commitHookPassiveMountEffects @ react-dom-client.development.js:10884
reconnectPassiveEffects @ react-dom-client.development.js:12818
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12838
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12838
doubleInvokeEffectsOnFiber @ react-dom-client.development.js:15719
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15693
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15700
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
commitDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15728
flushPassiveEffects @ react-dom-client.development.js:15493
eval @ react-dom-client.development.js:15347
performWorkUntilDeadline @ scheduler.development.js:44
hot-reloader-client.js:241 [Fast Refresh] rebuilding
hot-reloader-client.js:68 [Fast Refresh] done in 327ms
cache.ts:110 AI Cache stored for question: Ты живой?...
hot-reloader-client.js:241 [Fast Refresh] rebuilding
hot-reloader-client.js:68 [Fast Refresh] done in 412ms
error-prevention.ts:22  Server  🛡️ Error Prevention System started
useUserArtifacts.ts:130 Failed to setup realtime subscription: tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance
useUserArtifacts.useEffect.setupRealtimeSubscription @ useUserArtifacts.ts:130
await in useUserArtifacts.useEffect.setupRealtimeSubscription
useUserArtifacts.useEffect @ useUserArtifacts.ts:134
react-stack-bottom-frame @ react-dom-client.development.js:23696
runWithFiberInDEV @ react-dom-client.development.js:544
commitHookEffectListMount @ react-dom-client.development.js:10764
commitHookPassiveMountEffects @ react-dom-client.development.js:10884
reconnectPassiveEffects @ react-dom-client.development.js:12818
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
doubleInvokeEffectsOnFiber @ react-dom-client.development.js:15719
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15679
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15700
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
commitDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15728
flushPassiveEffects @ react-dom-client.development.js:15493
performSyncWorkOnRoot @ react-dom-client.development.js:15967
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:15830
commitRootImpl @ react-dom-client.development.js:15422
commitRoot @ react-dom-client.development.js:15273
commitRootWhenReady @ react-dom-client.development.js:14584
performWorkOnRoot @ react-dom-client.development.js:14505
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:15955
performWorkUntilDeadline @ scheduler.development.js:44
script.debug.js:1 [Vercel Web Analytics] [pageview] http://localhost:3000/app/storage {o: 'http://localhost:3000/app/storage', sv: '0.1.3', sdkn: '@vercel/analytics/next', sdkv: '1.5.0', ts: 1749723850851, …}
unified.ts:71 
            
            
           POST https://ipmrwigzyqjcgwligyau.supabase.co/storage/v1/object/sign/files/471b6aa7-fb85-4a27-9e0b-fa81f2d08ee6/level-1/business-plan-template.docx 400 (Bad Request)
eval @ fetch.js:50
eval @ fetch.js:72
fulfilled @ fetch.js:17
Promise.then
step @ fetch.js:30
eval @ fetch.js:32
__awaiter @ fetch.js:14
eval @ fetch.js:62
eval @ helpers.js:27
eval @ helpers.js:27
eval @ fetch.js:53
eval @ fetch.js:52
eval @ fetch.js:17
__awaiter @ fetch.js:13
_handleRequest @ fetch.js:51
eval @ fetch.js:73
eval @ fetch.js:17
__awaiter @ fetch.js:13
post @ fetch.js:72
eval @ StorageFileApi.js:276
eval @ StorageFileApi.js:15
__awaiter @ StorageFileApi.js:11
createSignedUrl @ StorageFileApi.js:273
shareFile @ unified.ts:71
handleDownload @ page.tsx:114
await in handleDownload
onClick @ page.tsx:280
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:121 Error downloading file: StorageApiError: Object not found
    at eval (fetch.js:29:20)
error @ intercept-console-error.js:51
handleDownload @ page.tsx:121
await in handleDownload
onClick @ page.tsx:280
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
hot-reloader-client.js:241 [Fast Refresh] rebuilding
hot-reloader-client.js:68 [Fast Refresh] done in 359ms
error-prevention.ts:22  Server  🛡️ Error Prevention System started
useUserArtifacts.ts:130 Failed to setup realtime subscription: tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance
useUserArtifacts.useEffect.setupRealtimeSubscription @ useUserArtifacts.ts:130
await in useUserArtifacts.useEffect.setupRealtimeSubscription
useUserArtifacts.useEffect @ useUserArtifacts.ts:134
react-stack-bottom-frame @ react-dom-client.development.js:23696
runWithFiberInDEV @ react-dom-client.development.js:544
commitHookEffectListMount @ react-dom-client.development.js:10764
commitHookPassiveMountEffects @ react-dom-client.development.js:10884
reconnectPassiveEffects @ react-dom-client.development.js:12818
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12811
recursivelyTraverseReconnectPassiveEffects @ react-dom-client.development.js:12790
reconnectPassiveEffects @ react-dom-client.development.js:12865
doubleInvokeEffectsOnFiber @ react-dom-client.development.js:15719
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15679
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
runWithFiberInDEV @ react-dom-client.development.js:544
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15700
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15686
commitDoubleInvokeEffectsInDEV @ react-dom-client.development.js:15728
flushPassiveEffects @ react-dom-client.development.js:15493
eval @ react-dom-client.development.js:15347
performWorkUntilDeadline @ scheduler.development.js:44
script.debug.js:1 [Vercel Web Analytics] [pageview] http://localhost:3000/app/user-settings {o: 'http://localhost:3000/app/user-settings', sv: '0.1.3', sdkn: '@vercel/analytics/next', sdkv: '1.5.0', ts: 1749723861131, …}
