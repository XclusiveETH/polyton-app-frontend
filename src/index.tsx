import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'App/App';
import { Providers } from 'Providers';
import { Modal } from 'components';
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";

import 'react-loading-skeleton/dist/skeleton.css'
import './index.css';

// Sentry.init({
//     dsn: "https://407b1599498a4ffc8603dd6d832f0398@o4504335221456896.ingest.sentry.io/4504335225192448",
//     integrations: [new BrowserTracing()],

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
//     environment: 'prod',
// });

const root = createRoot(
  	document.getElementById('root') as HTMLElement
);

root.render(
	<Providers>
		<Modal />
		<App />
	</Providers>
);
