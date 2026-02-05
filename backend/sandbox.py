import sys
import io
import contextlib
import traceback

def execute_code_safely(code):
    """
    Executes Python code and captures stdout/stderr.
    Includes basic security checks (blocking dangerous imports).
    """
    # 1. Basic Security Check
    forbidden = ["import os", "import sys", "import subprocess", "open(", "exec(", "eval("]
    for term in forbidden:
        if term in code:
            return "Security Alert: This sandbox does not allow file/system operations."

    # 2. Capture Output
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()

    try:
        with contextlib.redirect_stdout(stdout_capture), contextlib.redirect_stderr(stderr_capture):
            # Allow essential safe builtins for a better learning experience
            safe_builtins = {
                'print': print,
                'int': int,
                'str': str,
                'float': float,
                'len': len,
                'range': range,
                'list': list,
                'dict': dict,
                'set': set,
                'bool': bool,
                'abs': abs,
                'min': min,
                'max': max,
                'sum': sum,
                'round': round,
                'enumerate': enumerate,
                'zip': zip,
                'True': True,
                'False': False,
                'None': None,
            }
            exec(code, {"__builtins__": safe_builtins})
    except Exception:
        # Capture the traceback if it crashes
        traceback.print_exc(file=stderr_capture)

    output = stdout_capture.getvalue()
    error = stderr_capture.getvalue()

    return output + "\n" + error if error else output
