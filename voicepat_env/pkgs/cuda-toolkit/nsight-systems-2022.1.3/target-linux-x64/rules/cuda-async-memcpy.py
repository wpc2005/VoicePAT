#!/usr/bin/env python

import nsysstats

class AsyncMemcpyPageable(nsysstats.Report):

    ROW_LIMIT = 50

    usage = f"""{{SCRIPT}}[:rows=<limit>][:start=<time>][:end=<time>][:nvtx=<range[@domain]>] -- Async Memcpy with Pageable Memory

    Options:
        rows=<limit> - Maximum number of rows returned by the query.
            Default is {ROW_LIMIT}.

        start=<time> - Start time used for filtering in nanoseconds.

        end=<time> - End time used for filtering in nanoseconds.

        nvtx=<range[@domain]> - NVTX range text and domain used for filtering.
            Do not specify the domain for ranges in the default domain. Note
            that only the first matching record will be considered.
            If this option is used along with the 'start' and/or 'end' options,
            the explicit start/end times will override the NVTX range times.

    Output: All time values default to nanoseconds
        Duration : Duration of memcpy on GPU
        Start : Start time of memcpy on GPU
        Src Kind : Memcpy source memory kind
        Dst Kind : Memcpy destination memory kind
        Bytes : Number of bytes transferred
        PID : Process identifier
        Device ID : GPU device identifier
        Context ID : Context identifier
        Stream ID : Stream identifier
        API Name : Name of runtime API function

    This rule identifies asynchronous memory transfers that
    end up becoming synchronous if the memory is pageable.
"""

    query_async_memcpy_pageable = """
    WITH
        {MEM_KIND_STRS_CTE}
        sid AS (
            SELECT
                *
            FROM
                StringIds
            WHERE
                value LIKE 'cudaMemcpy%Async%'
        ),
        memcpy AS (
            SELECT
                *
            FROM
                CUPTI_ACTIVITY_KIND_MEMCPY
            WHERE
                   srcKind == 0
                OR dstKind == 0
        )
    SELECT
        memcpy.end - memcpy.start AS "Duration:dur_ns",
        memcpy.start AS "Start:ts_ns",
        msrck.name AS "Src Kind",
        mdstk.name AS "Dst Kind",
        memcpy.bytes AS "Bytes:mem_B",
        (memcpy.globalPid >> 24) & 0x00FFFFFF AS "PID",
        memcpy.deviceId AS "Device ID",
        memcpy.contextId AS "Context ID",
        memcpy.streamId AS "Stream ID",
        sid.value AS "API Name",
        memcpy.globalPid AS "_Global ID",
        memcpy.copyKind AS "_Copy Kind",
        'cuda' AS "_API"
    FROM
        memcpy
    JOIN
        sid
        ON sid.id == runtime.nameId
    JOIN
        main.CUPTI_ACTIVITY_KIND_RUNTIME AS runtime
        ON runtime.correlationId == memcpy.correlationId
    LEFT JOIN
        MemKindStrs AS msrck
        ON srcKind == msrck.id
    LEFT JOIN
        MemKindStrs AS mdstk
        ON dstKind == mdstk.id
    ORDER BY
        1 DESC
    LIMIT {ROW_LIMIT}
"""

    table_checks = {
        'CUPTI_ACTIVITY_KIND_RUNTIME':
            "{DBFILE} could not be analyzed because it does not contain the required CUDA data."
            " Does the application use CUDA runtime APIs?",
        'CUPTI_ACTIVITY_KIND_MEMCPY':
            "{DBFILE} could not be analyzed because it does not contain the required CUDA data."
            " Does the application use CUDA memcpy APIs?"
    }

    def setup(self):
        err = super().setup()
        if err != None:
            return err

        parser = self.ArgumentParser(allow_abbrev=False)
        parser.add_optional_arg('rows', default=self.ROW_LIMIT, type=int, \
            help='maximum number of rows returned by the query')
        parser.add_optional_arg('start', type=int, \
            help='start time used for filtering')
        parser.add_optional_arg('end', type=int, \
            help='end time used for filtering')
        parser.add_optional_arg('nvtx', type=str, \
            help='NVTX range and domain used for filtering')
        args = parser.parse_optional_dashless_args(self.args)

        err = self.filter_time_range(args.start, args.end, args.nvtx)
        if err != None:
            return err

        self.query = self.query_async_memcpy_pageable.format(
            MEM_KIND_STRS_CTE = self.MEM_KIND_STRS_CTE,
            ROW_LIMIT = args.rows)

if __name__ == "__main__":
    AsyncMemcpyPageable.Main()
