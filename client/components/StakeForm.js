import React from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { Form } from 'web3uikit';
import { ethers } from 'ethers';

function StakeForm() {
  const stakingAddress = "0x91F009d7816b4BB8F6777ba0dB070F5BcaA2213b"; //replace this with the address where you have deployed your staking Smart Contract
  const tesTokenAddress = "0x569685Aceb763D3952879020C2f80D56870ce8F2"; //replace this with the address where you have deployed your Reward Token Smart Contract

  const { runContractFunction } = useWeb3Contract();
  const { account, isWeb3Enabled } = useMoralis();

  let approveOptions = {
    abi: TokenAbi.abi,
    contractAddress: tesTokenAddress,
    functionName: 'approve'
  };

  let stakeOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'stake'
  };

  async function handleStakeSubmit(data) {
    if (isWeb3Enabled) {
      const amountToApprove = data.data[0].inputResult;
      approveOptions.params = {
        amount: ethers.utils.parseEther(amountToApprove, 'ether'),
        spender: stakingAddress
      };
  
      const tx = await runContractFunction({
        params: approveOptions,
        onError: (error) => console.log(error),
        onSuccess: () => {
          handleApproveSuccess(approveOptions.params.amount);
        }
      });
    } else {
      alert("Please connect to metamask wallet")
    }

  }

  async function handleApproveSuccess(amountToStakeFormatted) {
    stakeOptions.params = {
      amount: amountToStakeFormatted
    };

    const tx = await runContractFunction({
      params: stakeOptions,
      onError: (error) => console.log(error)
    });
    // console.log(tx);
    // await tx.wait();
    console.log('Stake transaction complete');
  }

  return (
    <div className='text-black'>
      <Form
        onSubmit={handleStakeSubmit}
        data={[
          {
            inputWidth: '50%',
            name: 'Amount to stake ',
            type: 'number',
            value: '',
            key: 'amountToStake'
          }
        ]}
        title="Stake Now!"
      ></Form>
    </div>
  );
}

export default StakeForm;
