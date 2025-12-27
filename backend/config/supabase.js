
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials missing in backend .env');

    // Provide a safe, chainable mock client so the app can start in dev
    // without crashing. All queries resolve to empty results and no-op errors.
    const makeChain = () => {
        const chain = {
            _actions: [],
            from(table) { this._actions.push(['from', table]); return this; },
            select() { this._actions.push(['select', Array.from(arguments)]); return this; },
            eq() { this._actions.push(['eq', Array.from(arguments)]); return this; },
            order() { this._actions.push(['order', Array.from(arguments)]); return this; },
            limit() { this._actions.push(['limit', Array.from(arguments)]); return this; },
            insert() { this._actions.push(['insert', Array.from(arguments)]); return this; },
            update() { this._actions.push(['update', Array.from(arguments)]); return this; },
            delete() { this._actions.push(['delete', Array.from(arguments)]); return this; },
            upsert() { this._actions.push(['upsert', Array.from(arguments)]); return this; },
            single() { return Promise.resolve({ data: null, error: null }); },
            then(resolve) { return resolve({ data: null, error: null }); },
            catch() { return this; }
        };
        return chain;
    };

    const mockClient = {
        from() { return makeChain(); },
        rpc() { return Promise.resolve({ data: null, error: null }); }
    };

    module.exports = mockClient;
} else {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    module.exports = supabase;
}
