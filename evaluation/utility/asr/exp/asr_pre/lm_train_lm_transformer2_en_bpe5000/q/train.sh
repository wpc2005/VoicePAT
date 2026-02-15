#!/bin/bash
cd /home/smg/miao/github_code/sas_2023/v9/speaker-anonymization-framework/evaluation/utility/asr_train
. ./path.sh
( echo '#' Running on `hostname`
  echo '#' Started at `date`
  set | grep SLURM | while read line; do echo "# $line"; done
  echo -n '# '; cat <<EOF
python3 -m espnet2.bin.lm_train --ngpu 4 --use_preprocessor true --bpemodel data/en_token_list/bpe_unigram5000/bpe.model --token_type bpe --token_list data/en_token_list/bpe_unigram5000/tokens.txt --non_linguistic_symbols none --cleaner none --g2p none --valid_data_path_and_name_and_type dump/raw/org/dev/text,text,text --valid_shape_file exp/asr_ori_numALL_spkALL_lr0.002/lm_stats_en_bpe5000/valid/text_shape.bpe --fold_length 150 --resume true --output_dir exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000 --config conf/tuning/train_lm_transformer2.yaml --train_data_path_and_name_and_type dump/raw/lm_train.txt,text,text --train_shape_file exp/asr_ori_numALL_spkALL_lr0.002/lm_stats_en_bpe5000/train/text_shape.bpe --ngpu 4 --multiprocessing_distributed True 
EOF
) >exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log
if [ "$CUDA_VISIBLE_DEVICES" == "NoDevFiles" ]; then
  ( echo CUDA_VISIBLE_DEVICES set to NoDevFiles, unsetting it... 
  )>>exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log
  unset CUDA_VISIBLE_DEVICES
fi
time1=`date +"%s"`
 ( python3 -m espnet2.bin.lm_train --ngpu 4 --use_preprocessor true --bpemodel data/en_token_list/bpe_unigram5000/bpe.model --token_type bpe --token_list data/en_token_list/bpe_unigram5000/tokens.txt --non_linguistic_symbols none --cleaner none --g2p none --valid_data_path_and_name_and_type dump/raw/org/dev/text,text,text --valid_shape_file exp/asr_ori_numALL_spkALL_lr0.002/lm_stats_en_bpe5000/valid/text_shape.bpe --fold_length 150 --resume true --output_dir exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000 --config conf/tuning/train_lm_transformer2.yaml --train_data_path_and_name_and_type dump/raw/lm_train.txt,text,text --train_shape_file exp/asr_ori_numALL_spkALL_lr0.002/lm_stats_en_bpe5000/train/text_shape.bpe --ngpu 4 --multiprocessing_distributed True  ) &>>exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log
ret=$?
sync || true
time2=`date +"%s"`
echo '#' Accounting: begin_time=$time1 >>exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log
echo '#' Accounting: end_time=$time2 >>exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log
echo '#' Accounting: time=$(($time2-$time1)) threads=1 >>exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log
echo '#' Finished at `date` with status $ret >>exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log
[ $ret -eq 137 ] && exit 100;
touch exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/q/done.19540
exit $[$ret ? 1 : 0]
## submitted with:
# sbatch --export=PATH  --job-name exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/train.log -p qgpu-debug --gres=gpu:tesla_a100_80g:4 --time 32:0:0  --cpus-per-gpu=2  --open-mode=append -e exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/q/train.log -o exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/q/train.log  /home/smg/miao/github_code/sas_2023/v9/speaker-anonymization-framework/evaluation/utility/asr_train/exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/q/train.sh >>exp/asr_ori_numALL_spkALL_lr0.002/lm_train_lm_transformer2_en_bpe5000/q/train.log 2>&1
