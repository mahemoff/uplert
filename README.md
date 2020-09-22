# uplert

Up Banking Alerts (unofficial experiment with [UpBank's API](https://developer.up.com.au/)).

This is currently a Node-based command line tool.

The goal is to provide alerts - perhaps via SMS or email - when your account balance is low, or perhaps based on some other triggers.

*This is an experimental tool - use at your own risk*

# Installation

1. [Get your personal API token](https://api.up.com.au/getting_started)
1. Get your account ID (will add this to the tool later)
1. Set environment variables UP_KEY and UP_ACCOUNT_ID from the above data
1. Run the tool `node uplert`
