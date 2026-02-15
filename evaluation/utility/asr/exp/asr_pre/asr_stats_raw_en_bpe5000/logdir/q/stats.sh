#!/bin/bash
cd /home/smg/miao/github_code/sas_2023/v9/speaker-anonymization-framework/evaluation/utility/asr_train
. ./path.sh
( echo '#' Running on `hostname`
  echo '#' Started at `date`
  set | grep SLURM | while read line; do echo "# $line"; done
  echo -n '# '; cat <<EOF
python3 -m espnet2.bin.asr_train --collect_stats true --use_preprocessor true --bpemodel data/en_token_list/bpe_unigram5000/bpe.model --token_type bpe --token_list data/en_token_list/bpe_unigram5000/tokens.txt --non_linguistic_symbols none --cleaner none --g2p none --train_shape_file exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/train.${SLURM_ARRAY_TASK_ID}.scp --valid_shape_file exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/valid.${SLURM_ARRAY_TASK_ID}.scp --output_dir exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.${SLURM_ARRAY_TASK_ID} --config conf/train_asr_conformer.yaml --frontend_conf fs=16k --train_data_path_and_name_and_type dump/raw/train_clean_360/wav.scp,speech,sound --valid_data_path_and_name_and_type dump/raw/dev/wav.scp,speech,sound --train_data_path_and_name_and_type dump/raw/train_clean_360/text,text,text --valid_data_path_and_name_and_type dump/raw/dev/text,text,text 
EOF
) >exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.$SLURM_ARRAY_TASK_ID.log
if [ "$CUDA_VISIBLE_DEVICES" == "NoDevFiles" ]; then
  ( echo CUDA_VISIBLE_DEVICES set to NoDevFiles, unsetting it... 
  )>>exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.$SLURM_ARRAY_TASK_ID.log
  unset CUDA_VISIBLE_DEVICES
fi
time1=`date +"%s"`
 ( python3 -m espnet2.bin.asr_train --collect_stats true --use_preprocessor true --bpemodel data/en_token_list/bpe_unigram5000/bpe.model --token_type bpe --token_list data/en_token_list/bpe_unigram5000/tokens.txt --non_linguistic_symbols none --cleaner none --g2p none --train_shape_file exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/train.${SLURM_ARRAY_TASK_ID}.scp --valid_shape_file exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/valid.${SLURM_ARRAY_TASK_ID}.scp --output_dir exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.${SLURM_ARRAY_TASK_ID} --config conf/train_asr_conformer.yaml --frontend_conf fs=16k --train_data_path_and_name_and_type dump/raw/train_clean_360/wav.scp,speech,sound --valid_data_path_and_name_and_type dump/raw/dev/wav.scp,speech,sound --train_data_path_and_name_and_type dump/raw/train_clean_360/text,text,text --valid_data_path_and_name_and_type dump/raw/dev/text,text,text  ) &>>exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.$SLURM_ARRAY_TASK_ID.log
ret=$?
sync || true
time2=`date +"%s"`
echo '#' Accounting: begin_time=$time1 >>exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.$SLURM_ARRAY_TASK_ID.log
echo '#' Accounting: end_time=$time2 >>exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.$SLURM_ARRAY_TASK_ID.log
echo '#' Accounting: time=$(($time2-$time1)) threads=1 >>exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.$SLURM_ARRAY_TASK_ID.log
echo '#' Finished at `date` with status $ret >>exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/stats.$SLURM_ARRAY_TASK_ID.log
[ $ret -eq 137 ] && exit 100;
touch exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/q/done.23618.$SLURM_ARRAY_TASK_ID
exit $[$ret ? 1 : 0]
## submitted with:
# sbatch --export=PATH  -p qcpu  --open-mode=append -e exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/q/stats.log -o exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/q/stats.log --array 1-5 /home/smg/miao/github_code/sas_2023/v9/speaker-anonymization-framework/evaluation/utility/asr_train/exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/q/stats.sh >>exp/asr_ori_numALL_spkALL_lr0.002/asr_stats_raw_en_bpe5000/logdir/q/stats.log 2>&1
