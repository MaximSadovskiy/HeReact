const Tests =
[
    {fn: test1, expected: `{"secretAtrib":123}` },
    {fn: test2, expected: `{"secretAtrib":123}` },
];

function test1() { return HeReact.prop({secretAtrib: 123}); }
function test2() { const obj = {secretAtrib: 123}; return HeReact.prop(obj); }
function hereactFunction() {}

//execute when page is loaded
(async function () {
    await TestLib.runTests(Tests);
})();