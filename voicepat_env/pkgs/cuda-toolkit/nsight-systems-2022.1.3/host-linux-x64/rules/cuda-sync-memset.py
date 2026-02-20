#!/usr/bin/env python

import nsysstats

class SyncMemset(nsysstats.Report):

    ROW_LIMIT = 50

    usage = f"""{{SCRIPT}}[:rows=<limit>][:start=<time>][:end=<time>][:nvtx=<range[@domain]>] -- Synchronous Memset

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
        Duration : Duration of memset on GPU
        Start : Start time of memset on GPU
        Memory Kind : Type of memory being set
        Bytes : Number of bytes set
        PID : Process identifier
        Device ID : GPU device identifier
        Context ID : Context identifier
        Stream ID : Stream identifier
        API Name : Name of runtime API function

    This rule identifies synchronous memset operations with pinned host
    memory or Unified Memory region.
"""

    query_sync_memset = """
    WITH
        {MEM_KIND_STRS_CTE}
        sid AS (
            SELECT
                *
            FROM
                StringIds
            WHERE
                    value LIKE 'cudaMemset%'
                AND value NOT LIKE '%async%'
        ),
        memset AS (
            SELECT
                *
            FROM
                CUPTI_ACTIVITY_KIND_MEMSET
            WHERE
                   memKind == 1
                OR memKind == 4
        )
    SELECT
        memset.end - memset.start AS "Duration:dur_ns",
        memset.start AS "Start:ts_ns",
        mk.name AS "Memory Kind",
        memset.bytes AS "Bytes:mem_B",
        (memset.globalPid >> 24) & 0x00FFFFFF AS "PID",
        memset.deviceId AS "Device ID",
        memset.contextId AS "Context ID",
        memset.streamId AS "Stream ID",
        sid.value AS "API Name",
        memset.globalPid AS "_Global ID",
        'cuda' AS "_API"
    FROM
        memset
    JOIN
        sid
        ON sid.id == runtime.nameId
    JOIN
        main.CUPTI_ACTIVITY_KIND_RUNTIME AS runtime
        ON runtime.correlationId == memset.correlationId
    LEFT JOIN
        MemKindStrs AS mk
        ON memKind == mk.id
    ORDER BY
        1 DESC
    LIMIT {ROW_LIMIT}
"""

    table_checks = {
        'CUPTI_ACTIVITY_KIND_RUNTIME':
            "{DBFILE} could not be analyzed because it does not contain the required CUDA data."
            " Does the application use CUDA runtime APIs?",
        'CUPTI_ACTIVITY_KIND_MEMSET':
            "{DBFILE} could not be analyzed because it does not contain the required CUDA data."
            " Does the application use CUDA memset APIs?"
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

        self.query = self.query_sync_memset.format(
            MEM_KIND_STRS_CTE = self.MEM_KIND_STRS_CTE,
            ROW_LIMIT = args.rows)

if __name__ == "__main__":
    SyncMemset.Main()
