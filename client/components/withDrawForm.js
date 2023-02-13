import React from 'react';
import { useWeb3Contract } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { Form } from 'web3uikit';
import { ethers } from 'ethers';

function withDrawForm() {
  const stakingAddress = "0x91F009d7816b4BB8F6777ba0dB070F5BcaA2213b"; //replace this with the address where you have deployed your staking Smart Contract
  const tesTokenAddress = "0x569685Aceb763D3952879020C2f80D56870ce8F2"; //replace this with the address where you have deployed your Reward Token Smart Contract

  const { runContractFunction } = useWeb3Contract();

  let approveOptions = {
    abi: TokenAbi.abi,
    contractAddress: tesTokenAddress,
    functionName: 'approve'
  };

  let withdrawOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'withdraw'
  };

  async function handlewithdrawSubmit(data) {
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
  }

  async function handleApproveSuccess(amountToWithdrawFormatted) {
    withdrawOptions.params = {
      amount: amountToWithdrawFormatted
    };

    const tx = await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error)
    });
    // console.log(tx);
    // await tx.wait();
    console.log('Withdraw transaction complete');
  }

  return (
    <div className='text-black mt-5'>
      <Form
        onSubmit={handlewithdrawSubmit}
        data={[
          {
            inputWidth: '50%',
            name: 'Amount to Withdraw ',
            type: 'number',
            value: '',
            key: 'amountToWithdraw'
          }
        ]}
        title="Withdraw Now!"
      ></Form>
    </div>
  );
}

export default withDrawForm;
