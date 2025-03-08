LogLevel =
{
    INFO     : 1,
    DEFAULT  : 2,
    WARN     : 3,
    ERROR    : 4,
    CRITICAL : 5,
}
// level : LogLevel, msg : String
function log(level, msg)
{
    switch (level) {
        case LogLevel.INFO: console.info("INFO: " + msg); break;
        case LogLevel.DEFAULT: console.log(msg); break;
        case LogLevel.WARN: console.warn(msg); break;
        case LogLevel.ERROR: console.error("ERROR: " + msg); break;
        case LogLevel.CRITICAL: fatal("CRITICAL: " + msg);
        default: fatal("Wrong log level");
    }
}
// bool -> (condition : bool, msg : String)
function assert(condition, msg)
{
    if (!condition) throw new Exception(msg);
}
// void -> (msg : String)
function fatal(msg)
{
    assert(0, msg);
}

class TestLib
{
    static FailedTests = [];
    
    // bool -> (val : any)
    static validateValue(val)
    {
        return val !== undefined && val !== null; // JS is retartet;
    }
    
    // bool -> (result : any, expected : any)
    static isEqual(result, expected)
    {
        if (typeof result == 'object')
            {
                for(const property in expected)
                {
                    if (!result.hasOwnProperty(property.toString()))
                        return false;
                    var isEqualV = true;
                    eval(`isEqualV = (result.${property} === expected.${property})`);
                    if (!isEqualV) return false;
                }
                return true;
            }
            else
                return result === expected;
        }
    // bool -> (Tests : [{fn, expected}, ...])
    static async runTests(Tests)
    {
        const body = document.querySelector("body");
        assert(this.validateValue(body), "Cannot found body, WTF");
        const hook = document.createElement("div");
        assert(this.validateValue(body), "Cannot create hook, WTF");
        body.style.backgroundColor = "black";
        hook.className = `test-hook`;
        body.appendChild(hook);
        
        const testCommonStyle = "font-size: 44px; color: white; border: solid gray 3px; max-width: 30%; min-width: 40vh; margin: 20px;";
        log(LogLevel.INFO, "Tests have started!");
        this.FailedTests.length = 0;
        for (let i = 0; i < Tests.length; ++i)
        {
            const testInst = Tests[i];
            testInst.fnName = testInst.fn.toString().split(" ")[1].split("()")[0] + "()";
            assert(this.validateValue(testInst.fnName),
                `Please provide correct function to test with index ${i}, current provided: ${testInst.fn}`);
            let result = undefined;
            let excep = undefined;
            try {
                result = await testInst.fn();
            } catch (e) { excep = e; }
            testInst.result = result;

            if (excep !== undefined || !this.isEqual(result, testInst.expected))
            {
                hook.insertAdjacentHTML("beforeend", `<div id="${i}" style="background-color: #811d1d; ${testCommonStyle}">${testInst.fnName}</div>`)
                log(LogLevel.DEFAULT, ` ${testInst.fnName}: error`);
                testInst.exception = excep;
                this.FailedTests.push(testInst);
            }
            else {
                hook.insertAdjacentHTML("beforeend", `<div id="${i}" style="background-color: green; ${testCommonStyle}">${testInst.fnName}</div>`)
                log(LogLevel.DEFAULT, ` ${testInst.fnName}: passed`);
            }
        }
        const successColor = this.FailedTests.length > 0 ? "red" : "green";
        hook.insertAdjacentHTML("beforeend", `<hr>`);
        hook.insertAdjacentHTML("beforeend", `<div style="color: #f6f07e; white-space: nowrap; font-size: 44px; ">Executed ${Tests.length} tests</div> `);
        hook.insertAdjacentHTML("beforeend", `<div style="color: ${successColor}; white-space: nowrap; font-size: 44px;">${this.FailedTests.length} failed:</div>`);    
        if (this.FailedTests.length > 0)
        {
            log(LogLevel.WARN, `${this.FailedTests.length} tests failed:\n`);
            
            let errorBox = null;
            if (this.FailedTests.length > 0)
            {
                errorBox = document.createElement("div");
                errorBox.className = "box";
                assert(this.validateValue(body), "Cannot create errorBox, WTF");
                hook.appendChild(errorBox);
            }
            for (let i = 0; i < this.FailedTests.length; ++i)
            {
                const failed = this.FailedTests[i];
                let errorStr = `\t ${failed.fnName} `;
                if (failed.exception !== undefined)
                    errorStr += `returned exception: \"${failed.exception}(${typeof failed.exception})\"`;
                else
                {
                    if (typeof failed.expected === 'object')
                        errorStr += `not all properties satisfied`;
                    else
                        errorStr += `expected: ${failed.expected}, got: ${failed.result}`;
                }
                errorBox.insertAdjacentHTML("beforeend", `<div style="color: white; white-space: nowrap; font-size: 44px;">    ${errorStr}</div>`);    
                log(LogLevel.WARN, errorStr);
            }
        }
        else
        {
            log(LogLevel.INFO, "All tests passed!");
            return true;
        }
        return false;
    }
}
